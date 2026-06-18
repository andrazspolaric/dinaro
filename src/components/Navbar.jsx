import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imgUnion, imgGroup, productsDropdown, solutionsDropdown } from '../shared';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { usePreloadRoute } from '../hooks/usePreloadRoute';
import { useT } from '../i18n/useT';
import { AnimatePresence, motion } from 'motion/react';
import './Navbar.css';

export default function Navbar({ activeItem }) {
	const [openNav, setOpenNav] = useState(null);
	const [hoveredNav, setHoveredNav] = useState(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [expandedSection, setExpandedSection] = useState(null);
	const navigate = useNavigate();
	const bp = useBreakpoint();
	const isMobile = bp === 'mobile' || bp === 'tablet';
	const preloadRoute = usePreloadRoute();
	const t = useT();

	const handleItemClick = (href) => {
		if (href) {
			navigate(href);
			setOpenNav(null);
			setMenuOpen(false);
		}
	};

	const handleNavKeyDown = (e, key) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setOpenNav(prev => prev === key ? null : key);
		} else if (e.key === 'Escape') {
			setOpenNav(null);
		}
	};

	// ── Mobile navbar ──
	if (isMobile) {
		return (
			<>
				{/* Mobile bar */}
				<div className="navbar-mobile">
					<button
						type="button"
						aria-label={t('nav.logoLabel')}
						className="navbar-mobile__logo"
						onClick={() => navigate('/')}
					>
						<img alt="Dinaro" src={imgUnion} />
					</button>

					<button
						type="button"
						aria-label={t('nav.openMenu')}
						className="navbar-mobile__hamburger"
						onClick={() => setMenuOpen(true)}
					>
						<span className="navbar-mobile__hamburger-bar" />
						<span className="navbar-mobile__hamburger-bar" />
						<span className="navbar-mobile__hamburger-bar" />
					</button>
				</div>

				{/* Fullscreen overlay */}
				<AnimatePresence>
					{menuOpen && (
						<motion.div
							className="navbar-mobile__overlay"
							initial={{ opacity: 0, x: '-100%' }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: '-100%' }}
							transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
						>
							{/* Overlay top bar */}
							<div className="navbar-mobile__overlay-header">
								<button
									type="button"
									aria-label="Dinaro home"
									className="navbar-mobile__overlay-logo"
									onClick={() => { navigate('/'); setMenuOpen(false); }}
								>
									<img alt="Dinaro" src={imgUnion} />
								</button>
								<button
									type="button"
									aria-label={t('nav.closeMenu')}
									className="navbar-mobile__close"
									onClick={() => setMenuOpen(false)}
								>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
									</svg>
								</button>
							</div>

							{/* Nav links */}
							<div className="navbar-mobile__nav">

								{/* Products accordion */}
								<div className="navbar-mobile__section">
									<button
										type="button"
										className="navbar-mobile__section-btn"
										onClick={() => setExpandedSection(s => s === 'products' ? null : 'products')}
									>
										<span className="navbar-mobile__section-label">{t('nav.customers')}</span>
										<svg
											width="20" height="20" viewBox="0 0 24 24" fill="none"
											className={`navbar-mobile__section-arrow${expandedSection === 'products' ? ' navbar-mobile__section-arrow--open' : ''}`}
										>
											<path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
									<AnimatePresence>
										{expandedSection === 'products' && (
											<motion.div
												className="navbar-mobile__accordion"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: 'auto', opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.25, ease: 'easeInOut' }}
											>
												<div className="navbar-mobile__accordion-inner">
													{productsDropdown.map(({ titleKey, items }) => (
														<div key={titleKey}>
															<p className="navbar-mobile__group-label">{t(titleKey)}</p>
															<div className="navbar-mobile__group-items">
																{items.map(({ labelKey, href }) => (
																	<button
																		key={labelKey}
																		type="button"
																		className={`navbar-mobile__item${!href ? ' navbar-mobile__item--disabled' : ''}`}
																		onTouchStart={() => href && preloadRoute(href)}
																		onClick={() => handleItemClick(href)}
																	>
																		{t(labelKey)}
																	</button>
																))}
															</div>
														</div>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* Solutions accordion */}
								<div className="navbar-mobile__section">
									<button
										type="button"
										className="navbar-mobile__section-btn"
										onClick={() => setExpandedSection(s => s === 'solutions' ? null : 'solutions')}
									>
										<span className="navbar-mobile__section-label">{t('nav.partners')}</span>
										<svg
											width="20" height="20" viewBox="0 0 24 24" fill="none"
											className={`navbar-mobile__section-arrow${expandedSection === 'solutions' ? ' navbar-mobile__section-arrow--open' : ''}`}
										>
											<path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
									<AnimatePresence>
										{expandedSection === 'solutions' && (
											<motion.div
												className="navbar-mobile__accordion"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: 'auto', opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.25, ease: 'easeInOut' }}
											>
												<div className="navbar-mobile__accordion-inner">
													{solutionsDropdown.map(({ titleKey, items }) => (
														<div key={titleKey}>
															<p className="navbar-mobile__group-label">{t(titleKey)}</p>
															<div className="navbar-mobile__group-items">
																{items.map(({ labelKey, href }) => (
																	<button
																		key={labelKey}
																		type="button"
																		className={`navbar-mobile__item${!href ? ' navbar-mobile__item--disabled' : ''}`}
																		onTouchStart={() => href && preloadRoute(href)}
																		onClick={() => handleItemClick(href)}
																	>
																		{t(labelKey)}
																	</button>
																))}
															</div>
														</div>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{[
									{ label: t('nav.company'), href: '/company' },
									{ label: t('nav.contact'), href: '/contact' },
								].map(({ label, href }) => (
									<button
										key={label}
										type="button"
										className="navbar-mobile__top-link"
										onTouchStart={() => preloadRoute(href)}
										onClick={() => handleItemClick(href)}
									>
										{label}
									</button>
								))}
							</div>

							{/* Get Started */}
							<div className="navbar-mobile__cta-wrap">
								<button
									type="button"
									className="navbar-mobile__cta"
									onTouchStart={() => preloadRoute('/contact')}
									onClick={() => handleItemClick('/contact')}
								>
									{t('nav.getStarted')}
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		);
	}

	// ── Desktop navbar ──
	const dropdownHeight = openNav === 'products' ? 375 : openNav === 'solutions' ? 402 : 80;

	return (
		<>
			{/* Backdrop overlay */}
			<AnimatePresence>
				{openNav && (
					<motion.div
						className="navbar__backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					/>
				)}
			</AnimatePresence>

			<nav
				className="navbar"
				aria-label={t('nav.mainNav')}
				style={{ height: dropdownHeight }}
				onMouseLeave={() => setOpenNav(null)}
			>
				<div className="navbar__inner">
					<button
						type="button"
						aria-label={t('nav.logoLabel')}
						className="navbar__logo"
						onClick={() => navigate('/')}
					>
						<img alt="Dinaro" src={imgUnion} />
					</button>

					<div className="navbar__links">
						{[
							{ label: t('nav.customers'), key: 'products', href: null, hasArrow: true },
							{ label: t('nav.partners'), key: 'solutions', href: null, hasArrow: true },
							{ label: t('nav.company'), key: null, href: '/company', hasArrow: false },
							{ label: t('nav.contact'), key: null, href: '/contact', hasArrow: false },
						].map(({ label, key, href, hasArrow }) => {
							const isActive = key && openNav === key;
							const isHovered = hoveredNav === label;
							const isDimmed = (openNav && !isActive) || (hoveredNav && !isHovered);
							return (
								<div
									key={label}
									className={`navbar__link${isDimmed ? ' navbar__link--dimmed' : ''}`}
									role={key ? 'button' : undefined}
									tabIndex={key || href ? 0 : undefined}
									aria-haspopup={key ? 'true' : undefined}
									aria-expanded={key ? String(isActive) : undefined}
									onMouseEnter={() => { setOpenNav(key || null); setHoveredNav(label); if (href) preloadRoute(href); }}
									onMouseLeave={() => setHoveredNav(null)}
									onKeyDown={key ? (e) => handleNavKeyDown(e, key) : undefined}
									onClick={href ? () => { navigate(href); setOpenNav(null); } : undefined}
								>
									<p className="navbar__link-label">{label}</p>
									{hasArrow && (
										<div className="navbar__link-arrow">
											<motion.img
												alt=""
												src={imgGroup}
												animate={{ rotate: isActive ? -90 : 90 }}
												transition={{ duration: 0.25, ease: 'easeInOut' }}
											/>
										</div>
									)}
								</div>
							);
						})}
					</div>

					<button
						type="button"
						className="navbar__cta"
						onMouseEnter={() => preloadRoute('/contact')}
						onClick={() => navigate('/contact')}
					>
						<p className="navbar__cta-label">{t('nav.getStarted')}</p>
					</button>
				</div>

				{/* Dropdowns */}
				<AnimatePresence mode="wait">
					{openNav === 'products' && (
						<motion.div
							key="products-dropdown"
							className="navbar__dropdown"
							role="menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							{productsDropdown.map(({ titleKey, titleHref, thumb, items }, index) => (
								<motion.div
									key={`products-${index}-${titleKey}`}
									className={`navbar__dropdown-card${titleHref ? ' navbar__dropdown-card--clickable' : ''}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
									onClick={titleHref ? () => handleItemClick(titleHref) : undefined}
									onMouseEnter={titleHref ? () => preloadRoute(titleHref) : undefined}
									style={titleHref ? { cursor: 'pointer' } : undefined}
								>
									<div
										className="navbar__dropdown-thumb"
										style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
									/>
									<div className="navbar__dropdown-body">
										<p className="navbar__dropdown-title">{t(titleKey)}</p>
										<div className="navbar__dropdown-items">
											{items.map(({ labelKey, href }) => (
												<button
													key={`${titleKey}-${labelKey}`}
													type="button"
													role="menuitem"
													className={`navbar__dropdown-item${!href ? ' navbar__dropdown-item--disabled' : ''}`}
													onMouseEnter={() => href && preloadRoute(href)}
													onClick={(e) => {
														e.stopPropagation();
														handleItemClick(href);
													}}
												>
													{t(labelKey)}
												</button>
											))}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
					{openNav === 'solutions' && (
						<motion.div
							key="solutions-dropdown"
							className="navbar__dropdown"
							role="menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							{solutionsDropdown.map(({ titleKey, titleHref, thumb, items }, index) => (
								<motion.div
									key={`solutions-${index}-${titleKey}`}
									className={`navbar__dropdown-card${titleHref ? ' navbar__dropdown-card--clickable' : ''}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
									onClick={titleHref ? () => handleItemClick(titleHref) : undefined}
									onMouseEnter={titleHref ? () => preloadRoute(titleHref) : undefined}
									style={titleHref ? { cursor: 'pointer' } : undefined}
								>
									<div
										className="navbar__dropdown-thumb"
										style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
									/>
									<div className="navbar__dropdown-body">
										<p className="navbar__dropdown-title">{t(titleKey)}</p>
										<div className="navbar__dropdown-items">
											{items.map(({ labelKey, href }) => (
												<button
													key={`${titleKey}-${labelKey}`}
													type="button"
													role="menuitem"
													className={`navbar__dropdown-item${!href ? ' navbar__dropdown-item--disabled' : ''}`}
													onMouseEnter={() => href && preloadRoute(href)}
													onClick={(e) => {
														e.stopPropagation();
														handleItemClick(href);
													}}
												>
													{t(labelKey)}
												</button>
											))}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</nav>
		</>
	);
}
