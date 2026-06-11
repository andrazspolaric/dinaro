import {useState, useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';
import './AccessibilityToggle.css';
import { detectLanguage, SL_ENABLED } from '../i18n/detectLanguage';
import { useT } from '../i18n/useT';
import flagGB from '../assets/flag-gb.svg';
import flagSI from '../assets/flag-si.svg';

const STORAGE_KEY = 'dinaro_a11y';

const FONT_SIZES = [-1, 0, 1, 2, 3];   // maps to classes a11y-fs-0..4
const LINE_HEIGHTS = [0, 1, 2, 3, 4];  // maps to classes a11y-lh-0..4 (index 1 = default/no class)

const SVG_PROPS = {
	viewBox: '0 0 24 24',
	width: '20',
	height: '20',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: '1.8',
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
};

const Icons = {
	fontSize: (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="Text Height"><title>Text Height</title><g fill="#000000"><polyline points="16.029 5.914 17.943 4 19.971 6.027" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline><path d="M8,8v9M4,8h8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><polyline points="19.971 18.086 18.057 20 16.029 17.973" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline><line x1="18" y1="20" x2="18" y2="4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><rect width="24" height="24" fill="none"></rect></g></svg>
	),
	lineHeight: (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="Line Height"><title>Line Height</title><g fill="#000000"><line x1="3" y1="20" x2="11" y2="20" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><line x1="3" y1="16" x2="9" y2="16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><line x1="3" y1="12" x2="11" y2="12" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><line x1="3" y1="8" x2="9" y2="8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><line x1="3" y1="4" x2="11" y2="4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><line x1="18" y1="20" x2="18" y2="4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><polyline points="20.5 17.5 18 20 15.5 17.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline><polyline points="15.5 6.5 18 4 20.5 6.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline><rect width="24" height="24" transform="translate(24 24) rotate(180)" fill="none"></rect></g></svg>
	),
	readingFont: (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M20.25 10.0049C20.25 9.67388 20.1185 9.35641 19.8848 9.12207C19.651 8.88774 19.3339 8.75567 19.0029 8.75488L17.75 8.75098V19C17.75 19.3315 17.8818 19.6494 18.1162 19.8838C18.3506 20.1182 18.6685 20.25 19 20.25C19.3315 20.25 19.6494 20.1182 19.8838 19.8838C20.1182 19.6494 20.25 19.3315 20.25 19V10.0049ZM16.25 6C16.25 5.66848 16.1182 5.35063 15.8838 5.11621C15.6494 4.88179 15.3315 4.75 15 4.75H5C4.66848 4.75 4.35063 4.88179 4.11621 5.11621C3.88179 5.35063 3.75 5.66848 3.75 6V19C3.75 19.3315 3.88179 19.6494 4.11621 19.8838C4.35063 20.1182 4.66848 20.25 5 20.25H16.5527C16.3567 19.8662 16.25 19.439 16.25 19V6ZM17.75 7.25098L19.0068 7.25488C19.7349 7.25669 20.433 7.54703 20.9473 8.0625C21.4615 8.57802 21.75 9.27676 21.75 10.0049V19C21.75 19.7293 21.4601 20.4286 20.9443 20.9443C20.4286 21.4601 19.7293 21.75 19 21.75H5C4.27065 21.75 3.57139 21.4601 3.05566 20.9443C2.53994 20.4286 2.25 19.7293 2.25 19V6C2.25 5.27065 2.53994 4.57139 3.05566 4.05566C3.57139 3.53994 4.27065 3.25 5 3.25H15C15.7293 3.25 16.4286 3.53994 16.9443 4.05566C17.4601 4.57139 17.75 5.27065 17.75 6V7.25098Z" fill="black"/>
			<path d="M13.5 16.25C13.9142 16.25 14.25 16.5858 14.25 17C14.25 17.4142 13.9142 17.75 13.5 17.75H6.5C6.08579 17.75 5.75 17.4142 5.75 17C5.75 16.5858 6.08579 16.25 6.5 16.25H13.5Z" fill="black"/>
			<path d="M13.5 13.25C13.9142 13.25 14.25 13.5858 14.25 14C14.25 14.4142 13.9142 14.75 13.5 14.75H6.5C6.08579 14.75 5.75 14.4142 5.75 14C5.75 13.5858 6.08579 13.25 6.5 13.25H13.5Z" fill="black"/>
			<path d="M7.25 10.25H12.75V8.75H7.25V10.25ZM14.25 10.5C14.25 11.1904 13.6904 11.75 13 11.75H7C6.30964 11.75 5.75 11.1904 5.75 10.5V8.5C5.75 7.80964 6.30964 7.25 7 7.25H13C13.6904 7.25 14.25 7.80964 14.25 8.5V10.5Z" fill="black"/>
		</svg>
	),
	bigCursor: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.922 3.562a1.577 1.577 0 0 0-1.089.908l-.093.23v13.006l.099.145c.21.306.614.408.943.237.087-.045.788-.478 1.558-.962a76.104 76.104 0 0 1 1.404-.873l.92 1.807c.717 1.412.95 1.836 1.082 1.968.355.355.908.515 1.373.395.314-.08 2.678-1.285 2.908-1.481.333-.285.538-.893.453-1.343-.027-.143-.337-.802-.943-2.009-.497-.988-.897-1.803-.889-1.811.007-.008.738-.302 1.623-.654.886-.352 1.662-.678 1.726-.723a.826.826 0 0 0 .205-.265.673.673 0 0 0-.072-.707c-.162-.221-10.122-7.686-10.388-7.786a1.646 1.646 0 0 0-.82-.082m9.155 8.078c0 .011-.629.269-1.399.574-.816.322-1.452.597-1.525.658-.156.131-.233.313-.233.551 0 .163.129.44 1.082 2.32l1.081 2.135-1.158.58-1.159.579-1.053-2.087c-.579-1.148-1.096-2.138-1.148-2.2-.137-.164-.292-.23-.537-.23-.247 0-.237-.005-1.888 1.034l-.96.604-.01-5.549c-.006-3.052-.002-5.572.009-5.601.013-.033 1.625 1.153 4.459 3.28a524.02 524.02 0 0 1 4.439 3.352" fill-rule="evenodd"></path></svg>
	),
	letterSpacing: (
		<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M2.815 3.278c-.484.115-.717.726-.432 1.13.075.1.17.184.277.248.159.083.191.084 4.219.095 2.865.008 4.122-.002 4.274-.034.749-.155.777-1.244.036-1.431-.21-.052-8.155-.06-8.374-.008M17.9 3.259c-.053.016-.106.03-.16.04-.162.036-2.795 2.648-2.904 2.881a.907.907 0 0 0-.074.32c0 .18.108.446.224.548a.918.918 0 0 0 .514.192c.273 0 .424-.107 1.09-.771l.65-.648v12.358l-.65-.648c-.672-.669-.817-.772-1.099-.77-.173.001-.439.112-.539.225a.794.794 0 0 0-.116.834c.05.106.535.617 1.429 1.506 1.283 1.274 1.365 1.347 1.545 1.385a.935.935 0 0 0 .38 0c.18-.038.262-.111 1.545-1.385.894-.889 1.379-1.4 1.429-1.506a.794.794 0 0 0-.116-.834c-.1-.113-.366-.224-.539-.225-.282-.002-.427.101-1.099.77l-.65.648V5.821l.65.648c.666.664.817.771 1.09.771.16 0 .398-.089.514-.192.116-.102.224-.368.224-.548 0-.309-.099-.43-1.484-1.805-.734-.729-1.37-1.344-1.414-1.366-.091-.045-.38-.092-.44-.07M2.815 7.278c-.484.115-.717.726-.432 1.13.075.1.17.184.277.248.158.083.205.084 3.218.095C8.02 8.759 9 8.749 9.151 8.718c.751-.156.78-1.245.038-1.432-.21-.052-6.156-.06-6.374-.008m0 4c-.484.115-.717.726-.432 1.13.075.1.17.184.277.248.159.083.191.084 4.219.095 2.865.008 4.122-.002 4.274-.034.749-.155.777-1.244.036-1.431-.21-.052-8.155-.06-8.374-.008m0 4c-.484.115-.717.726-.432 1.13.075.1.17.184.277.248.158.083.205.084 3.218.095 2.142.008 3.122-.002 3.273-.033.751-.156.78-1.245.038-1.432-.21-.052-6.156-.06-6.374-.008m0 4c-.484.115-.717.726-.432 1.13.075.1.17.184.277.248.159.083.191.084 4.219.095 2.865.008 4.122-.002 4.274-.034.749-.155.777-1.244.036-1.431-.21-.052-8.155-.06-8.374-.008" transform="rotate(90 126.65 129.331) scale(10.66667)"></path></svg>
	),
	textCenter: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.72 3.805c-.262.104-.451.395-.451.695a.75.75 0 0 0 .464.697c.158.06 16.376.06 16.534 0a.75.75 0 0 0 .464-.697.75.75 0 0 0-.464-.697c-.151-.058-16.403-.055-16.547.002m2 5c-.262.104-.451.395-.451.695a.75.75 0 0 0 .464.697c.158.06 12.376.06 12.534 0a.75.75 0 0 0 .464-.697.75.75 0 0 0-.464-.697c-.151-.058-12.403-.055-12.547.002m-2 5c-.262.104-.451.395-.451.695a.75.75 0 0 0 .464.697c.158.06 16.376.06 16.534 0a.75.75 0 0 0 .464-.697.75.75 0 0 0-.464-.697c-.151-.058-16.403-.055-16.547.002m4 5c-.262.104-.451.395-.451.695a.75.75 0 0 0 .464.697c.077.03 1.429.043 4.267.043s4.19-.013 4.267-.043a.75.75 0 0 0 .464-.697.75.75 0 0 0-.464-.697c-.15-.057-8.404-.055-8.547.002" fill-rule="evenodd"></path></svg>
	),
	bold: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.533 2.282c-2.527.207-4.649 2.073-5.15 4.529-.124.602-.142 1.271-.142 5.189s.018 4.587.142 5.189c.445 2.183 2.245 3.983 4.428 4.428.602.124 1.271.142 5.189.142s4.587-.018 5.189-.141c2.179-.445 3.984-2.25 4.429-4.429.123-.602.141-1.271.141-5.189s-.018-4.587-.141-5.189c-.292-1.427-1.211-2.78-2.438-3.589-.858-.566-1.705-.854-2.771-.942-.546-.045-8.323-.044-8.876.002m9.487 1.583c1.616.474 2.683 1.556 3.128 3.175.067.243.072.568.072 4.96s-.005 4.717-.072 4.96c-.229.832-.597 1.484-1.15 2.038-.554.553-1.206.921-2.038 1.15-.243.067-.568.072-4.96.072s-4.717-.005-4.96-.072c-.832-.229-1.484-.597-2.038-1.15a4.422 4.422 0 0 1-1.146-2.038c-.073-.286-.076-.511-.076-4.98V7.3l.09-.326a4.39 4.39 0 0 1 1.132-1.972A4.397 4.397 0 0 1 7.4 3.786c.055-.009 2.179-.013 4.72-.01 4.531.007 4.625.009 4.9.089M8.291 6.843c-.242.095-.525.353-.658.602l-.093.175v8.76l.093.175c.138.257.415.507.67.603.215.08.289.082 3.12.082 3.285 0 3.256.002 3.877-.3a2.893 2.893 0 0 0 1.074-.873c.385-.507.566-.99.612-1.627.064-.898-.234-1.658-.915-2.335l-.357-.355.099-.105c.191-.203.415-.6.526-.931.146-.436.184-1.135.087-1.602-.208-1.006-.997-1.88-2.006-2.223l-.32-.108-2.8-.01c-2.729-.008-2.805-.007-3.009.072m5.492 1.44c.31.057.576.205.801.445.712.762.466 1.961-.495 2.405-.187.086-.217.087-2.639.098L9 11.242V8.24h2.273c1.463 0 2.357.015 2.51.043m.637 4.529c.271.085.474.212.663.414.707.758.472 1.938-.474 2.387l-.269.127-2.67.012-2.67.011V12.76l2.63.001c2.005 0 2.668.012 2.79.051" fill-rule="evenodd"></path></svg>
	),
	lightContrast: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.66 1.276a.734.734 0 0 0-.398.413c-.097.232-.087 1.433.014 1.651.283.614 1.165.614 1.448 0 .063-.136.074-.263.074-.84s-.011-.704-.074-.84a.799.799 0 0 0-1.064-.384M4.701 4.149c-.135.035-.344.197-.447.348a.872.872 0 0 0-.094.687c.065.199.908 1.072 1.14 1.18a.847.847 0 0 0 .895-.136c.224-.206.305-.605.183-.899-.08-.195-.91-1.035-1.118-1.132a.924.924 0 0 0-.559-.048m14.039.045c-.21.102-1.039.942-1.118 1.135-.122.294-.041.693.183.899a.847.847 0 0 0 .895.136c.232-.108 1.075-.981 1.14-1.18a.838.838 0 0 0-.34-.932.838.838 0 0 0-.76-.058m-7.287 1.528a6.256 6.256 0 0 0-3.908 1.823 6.296 6.296 0 0 0 0 8.91 6.303 6.303 0 0 0 8.284.553c3.023-2.309 3.318-6.771.626-9.463-1.079-1.079-2.422-1.697-3.966-1.825-.511-.042-.503-.042-1.036.002m1.319 1.658a4.666 4.666 0 0 1 2.629 1.404 4.673 4.673 0 0 1 0 6.432c-2.251 2.371-6.145 1.779-7.612-1.156A4.765 4.765 0 0 1 7.32 12c0-2.28 1.62-4.209 3.877-4.618a5.652 5.652 0 0 1 1.575-.002M1.66 11.276c-.626.289-.608 1.196.029 1.462.232.097 1.433.087 1.651-.014.614-.283.614-1.165 0-1.448-.136-.063-.263-.074-.84-.074s-.704.011-.84.074m19 0c-.626.289-.608 1.196.029 1.462.232.097 1.433.087 1.651-.014.487-.224.614-.88.248-1.279-.191-.207-.351-.243-1.088-.243-.577 0-.704.011-.84.074M5.3 17.636c-.232.108-1.075.981-1.14 1.18-.198.612.412 1.222 1.024 1.024.199-.065 1.072-.908 1.18-1.14.139-.3.064-.714-.169-.928a.847.847 0 0 0-.895-.136m12.72 0a.796.796 0 0 0-.383 1.064c.097.208.937 1.038 1.132 1.118.223.093.433.077.675-.049a.797.797 0 0 0 .374-1c-.08-.195-.91-1.035-1.118-1.132a.843.843 0 0 0-.68-.001m-6.36 2.64a.734.734 0 0 0-.398.413c-.097.232-.087 1.433.014 1.651.224.487.88.614 1.279.248.207-.191.243-.351.243-1.088 0-.577-.011-.704-.074-.84a.799.799 0 0 0-1.064-.384" fill-rule="evenodd"></path></svg>
	),
	highContrast: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.34 2.281C7.073 2.553 3.439 5.66 2.499 9.84a10.086 10.086 0 0 0 0 4.32 9.76 9.76 0 0 0 7.341 7.341c1.393.313 2.93.312 4.336-.003 3.289-.739 5.985-3.188 7.068-6.422a9.928 9.928 0 0 0 .257-5.236 9.76 9.76 0 0 0-7.341-7.341 10.445 10.445 0 0 0-2.82-.218m1.621 1.521a8.318 8.318 0 0 1 5.894 3.608c.543.802 1.034 1.968 1.222 2.899.124.611.163 1.019.163 1.691 0 1.332-.263 2.465-.845 3.642a8.146 8.146 0 0 1-3.753 3.753c-1.177.582-2.31.845-3.642.845a7.867 7.867 0 0 1-3.626-.836 8.266 8.266 0 0 1-4.572-6.443c-.054-.436-.054-1.486 0-1.922.195-1.582.857-3.123 1.846-4.299.337-.4.751-.811 1.168-1.159 1.084-.904 2.682-1.585 4.168-1.775.395-.051 1.579-.053 1.977-.004m-1.262 2.011c-.15.069-.368.313-.408.458-.017.06-.031 2.656-.031 5.769 0 6.313-.025 5.767.277 6.032.179.157.335.186.852.154 2.505-.153 4.703-1.825 5.504-4.186.261-.767.323-1.159.323-2.04s-.062-1.273-.323-2.04C17.08 7.564 14.82 5.873 12.3 5.776c-.358-.014-.511-.005-.601.037m1.751 1.668a5.68 5.68 0 0 1 1.21.578c.309.202 1.079.972 1.281 1.281 1.272 1.95 1.013 4.444-.627 6.045a4.708 4.708 0 0 1-1.391.952c-.346.152-.954.343-1.087.343-.074 0-.076-.119-.076-4.685V7.31l.17.027c.093.015.328.08.52.144" fill-rule="evenodd"></path></svg>
	),
	monochrome: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.32 2.281a9.812 9.812 0 0 0-5.418 2.111c-.363.287-1.223 1.147-1.51 1.51-1.12 1.417-1.801 3.021-2.055 4.838-.09.647-.09 1.874.001 2.52.254 1.817.936 3.423 2.054 4.838.287.363 1.147 1.223 1.51 1.51A10.013 10.013 0 0 0 9.9 21.516c1.326.29 2.874.29 4.2 0a10.013 10.013 0 0 0 3.998-1.908c.363-.287 1.223-1.147 1.51-1.51a10.013 10.013 0 0 0 1.908-3.998c.29-1.326.29-2.874 0-4.2a10.013 10.013 0 0 0-1.908-3.998c-.287-.363-1.147-1.223-1.51-1.51a9.843 9.843 0 0 0-6.778-2.111m-.08 3.239v1.72H8.26c-1.639 0-2.98-.012-2.98-.026 0-.049.459-.598.778-.929a8.301 8.301 0 0 1 4.543-2.422c.165-.03.376-.056.469-.059l.17-.004v1.72m2.441-1.598c1.228.253 2.593.9 3.503 1.659.986.823 1.68 1.695 2.218 2.793A7.864 7.864 0 0 1 20.24 12a7.864 7.864 0 0 1-.838 3.626c-.538 1.098-1.232 1.97-2.218 2.793-1.083.904-2.829 1.644-4.173 1.769l-.251.024V3.788l.251.024c.138.013.44.062.67.11M11.24 10v1.24H3.8v-.133c0-.377.249-1.42.487-2.037l.119-.31h6.834V10m0 4v1.24H4.406l-.119-.31c-.238-.617-.487-1.66-.487-2.037v-.133h7.44V14m0 4.486v1.726l-.251-.024c-.761-.071-1.789-.38-2.615-.786-.875-.429-1.445-.833-2.167-1.537-.31-.303-.927-1.021-.927-1.079 0-.014 1.341-.026 2.98-.026h2.98v1.726" fill-rule="evenodd"></path></svg>
	),
	readingLine: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.74 4.266a3.841 3.841 0 0 0-2.334 1.031c-.526.494-.95 1.287-1.093 2.045-.037.194-.053.671-.053 1.578 0 1.29.001 1.301.093 1.449.357.574 1.223.443 1.363-.207.026-.123.044-.667.044-1.356 0-1.271.021-1.425.25-1.863.165-.314.619-.768.933-.933.507-.266.065-.25 7.057-.25 6.994 0 6.554-.016 7.054.25.466.249.868.708 1.073 1.224.085.214.091.298.111 1.606.022 1.356.024 1.383.115 1.529a.74.74 0 0 0 1.368-.235c.071-.342.029-2.536-.056-2.909-.334-1.469-1.393-2.529-2.89-2.894-.251-.061-.828-.068-6.575-.073a830.09 830.09 0 0 0-6.46.008m-3.925 8.012c-.484.115-.717.726-.432 1.13.193.273.35.328.98.346.71.019.953-.03 1.156-.233.399-.399.212-1.098-.33-1.235-.201-.05-1.173-.056-1.374-.008m4.796.001a.858.858 0 0 0-.478.373c-.093.18-.087.542.012.712.043.074.156.189.25.255.167.118.182.12.741.135.74.019.978-.028 1.183-.233.41-.41.206-1.116-.357-1.237-.23-.049-1.151-.053-1.351-.005m4.615.005c-.338.08-.546.352-.546.716 0 .373.206.635.564.717.228.053 1.284.053 1.512 0 .358-.082.564-.344.564-.717s-.206-.635-.564-.717c-.215-.05-1.317-.049-1.53.001m4.781.001c-.533.126-.722.84-.326 1.236.205.205.444.252 1.179.233.535-.014.576-.021.729-.122a.699.699 0 0 0 .344-.632.7.7 0 0 0-.345-.633c-.157-.104-.182-.107-.785-.115-.343-.004-.701.011-.796.033m4.647-.007c-.645.154-.786 1.02-.22 1.353.178.104.213.11.83.123.819.018 1.046-.024 1.255-.233.399-.399.212-1.098-.33-1.235-.202-.05-1.331-.056-1.535-.008M2.815 15.277a.8.8 0 0 0-.462.354c-.089.143-.093.181-.092.949.002 1.092.093 1.531.458 2.208a3.736 3.736 0 0 0 2.623 1.899c.409.078 12.907.078 13.316 0a3.768 3.768 0 0 0 3.004-2.912c.084-.388.122-1.61.06-1.909a.74.74 0 0 0-1.369-.235c-.087.14-.094.201-.116 1.029-.021.777-.034.906-.112 1.106a2.426 2.426 0 0 1-1.071 1.224c-.5.266-.06.25-7.054.25-6.992 0-6.55.016-7.057-.25-.314-.165-.768-.619-.933-.933-.206-.394-.25-.633-.251-1.375-.001-.731-.037-.959-.179-1.146-.159-.209-.502-.325-.765-.259" fill-rule="evenodd"></path></svg>
	),
	readingMask: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.699 3.816c-.149.065-.367.308-.408.455-.017.06-.031.667-.031 1.349.001 1.086.01 1.27.074 1.48A2.326 2.326 0 0 0 4.9 8.666c.229.071.554.074 7.1.074 6.546 0 6.871-.003 7.1-.074A2.326 2.326 0 0 0 20.666 7.1c.064-.21.073-.394.074-1.48 0-.682-.014-1.289-.031-1.349-.042-.152-.262-.392-.417-.457a.742.742 0 0 0-.786.139c-.243.23-.244.236-.266 1.593l-.02 1.247-.121.149a1.064 1.064 0 0 1-.259.224c-.134.071-.389.074-6.84.074s-6.706-.003-6.84-.074a1.064 1.064 0 0 1-.259-.224l-.121-.149-.02-1.247c-.022-1.357-.023-1.363-.266-1.593a.756.756 0 0 0-.795-.137m1.116 7.462c-.484.115-.717.726-.432 1.13a.939.939 0 0 0 .277.248l.16.084 7.06.011c5.04.007 7.121-.002 7.274-.034.748-.155.775-1.244.035-1.431-.211-.053-14.154-.061-14.374-.008m.365 4.003c-.852.114-1.557.722-1.831 1.579-.084.265-.089.347-.089 1.52 0 .682.014 1.289.031 1.349.042.152.262.392.417.457a.742.742 0 0 0 .786-.139c.243-.23.244-.236.266-1.593l.02-1.247.121-.149c.067-.082.183-.183.259-.224.134-.071.389-.074 6.84-.074s6.706.003 6.84.074c.076.041.192.142.259.224l.121.149.02 1.247c.022 1.357.023 1.363.266 1.593.205.194.521.25.786.139.155-.065.375-.305.417-.457.017-.06.031-.667.031-1.349-.001-1.086-.01-1.27-.074-1.48-.228-.75-.782-1.31-1.546-1.566-.21-.07-.532-.074-6.96-.079-3.707-.003-6.848.009-6.98.026" fill-rule="evenodd"></path></svg>
	),
	hidePhotos: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.815 2.277c-.486.121-.717.727-.432 1.131a.939.939 0 0 0 .277.248c.158.083.209.084 3.58.104l3.42.02.32.11c.538.184.878.399 1.304.826.427.426.642.766.826 1.304l.11.32.012 2.413.012 2.413-.252-.203c-.593-.481-1.196-.689-1.992-.689-.757 0-1.265.161-1.86.588-.132.095-1.112 1.046-2.179 2.114l-1.939 1.942-.441-.432c-.531-.521-.785-.715-1.181-.903a3.377 3.377 0 0 0-2.12-.243 4.121 4.121 0 0 0-1.147.502c-.106.071-.908.842-1.783 1.713l-1.59 1.583v-3.047c0-2.074-.014-3.113-.044-3.253-.141-.656-1.003-.787-1.363-.207l-.093.149v3.36c0 3.09.006 3.389.073 3.72.397 1.966 1.841 3.41 3.807 3.807.338.068.701.073 5.86.073 5.159 0 5.522-.005 5.86-.073 1.966-.397 3.41-1.841 3.807-3.807.068-.338.073-.701.073-5.86 0-5.159-.005-5.522-.073-5.86-.39-1.929-1.785-3.356-3.703-3.787-.374-.084-.467-.087-3.704-.097-1.826-.006-3.376.004-3.445.021M4.18 3.835a.61.61 0 0 0-.358.375.742.742 0 0 0 0 .581c.036.089.274.363.589.679l.528.53-.528.53c-.546.549-.652.707-.65.979.001.173.112.439.225.539a.918.918 0 0 0 .514.192c.263 0 .426-.109.97-.651L6 7.061l.53.528c.549.546.707.652.979.65.173-.001.439-.112.539-.225A.918.918 0 0 0 8.24 7.5c0-.263-.109-.426-.651-.97L7.061 6l.528-.53c.542-.544.651-.707.651-.97a.918.918 0 0 0-.192-.514c-.1-.113-.366-.224-.539-.225-.272-.002-.43.104-.979.65L6 4.939l-.53-.528c-.316-.315-.59-.553-.679-.589a.756.756 0 0 0-.611.013m14.515 8.075c.231.11.378.232.912.76l.637.628-.013 2.181-.012 2.181-.109.32c-.184.537-.399.878-.826 1.304-.534.535-1.13.846-1.787.934l-.203.028-2.11-2.13-2.11-2.13 1.913-1.914c1.052-1.053 1.979-1.96 2.06-2.016a2.49 2.49 0 0 1 .38-.2c.201-.084.285-.096.613-.087.333.01.414.027.655.141m-9.198 2.911c.108.032.279.107.38.165.179.104 1.16 1.071 3.943 3.885l1.356 1.371-4.418-.011-4.418-.011-.32-.11c-.552-.189-.877-.397-1.33-.852-.225-.227-.41-.435-.41-.464 0-.029.832-.884 1.85-1.899 1.86-1.856 1.965-1.949 2.368-2.076.225-.071.762-.07.999.002" fill-rule="evenodd"></path></svg>
	),
	highlightContent: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.84 2.265a1.794 1.794 0 0 0-1.514 1.23c-.056.173-.066.402-.066 1.485 0 1.412.013 1.515.243 1.9.223.372.597.673.972.78.102.03.316.066.475.081l.29.027v8.464l-.29.027c-.522.05-.833.182-1.163.496a1.996 1.996 0 0 0-.471.785c-.08.287-.08 2.633 0 2.92.154.55.624 1.034 1.179 1.214.173.056.402.066 1.485.066 1.412 0 1.515-.013 1.9-.243.372-.223.673-.597.78-.972.03-.102.066-.315.081-.475l.027-.29h8.462l.027.29c.015.159.052.373.082.475.11.377.409.75.781.972.385.23.488.243 1.9.243 1.083 0 1.312-.01 1.485-.066a1.852 1.852 0 0 0 1.179-1.214c.08-.287.08-2.633 0-2.92a1.996 1.996 0 0 0-.471-.785c-.33-.314-.641-.446-1.163-.496l-.29-.027V7.768l.29-.027c.16-.015.373-.051.475-.081.375-.107.749-.408.972-.78.23-.385.243-.488.243-1.9 0-1.083-.01-1.312-.066-1.485a1.852 1.852 0 0 0-1.214-1.179c-.287-.08-2.633-.08-2.92 0a1.996 1.996 0 0 0-.785.471c-.313.329-.448.645-.498 1.163l-.027.29H7.768l-.027-.29c-.037-.394-.109-.625-.273-.877a1.745 1.745 0 0 0-.582-.571c-.349-.217-.451-.231-1.726-.243a29.52 29.52 0 0 0-1.32.006m2.327 1.561c.067.061.073.152.073 1.167 0 .968-.008 1.11-.066 1.174-.061.067-.152.073-1.167.073-.968 0-1.11-.008-1.174-.066-.067-.061-.073-.152-.073-1.167 0-.968.008-1.11.066-1.174.061-.067.152-.073 1.167-.073.968 0 1.11.008 1.174.066m14 0c.067.061.073.152.073 1.167 0 .968-.008 1.11-.066 1.174-.061.067-.152.073-1.167.073-.968 0-1.11-.008-1.174-.066-.067-.061-.073-.152-.073-1.167 0-.968.008-1.11.066-1.174.061-.067.152-.073 1.167-.073.968 0 1.11.008 1.174.066m-3.91 2.224c.037.391.11.623.275.877.33.509.752.751 1.418.814l.29.027v8.464l-.29.027c-.394.037-.625.109-.877.273-.508.329-.753.755-.816 1.418l-.027.29H7.768l-.027-.29c-.063-.666-.305-1.088-.814-1.418-.252-.164-.483-.236-.877-.273l-.29-.027V7.768l.29-.027c.666-.063 1.088-.305 1.418-.814.164-.252.236-.483.273-.877l.027-.29h8.462l.027.29M6.167 17.826c.067.061.073.152.073 1.167 0 .968-.008 1.11-.066 1.174-.061.067-.152.073-1.167.073-.968 0-1.11-.008-1.174-.066-.067-.061-.073-.152-.073-1.167 0-.968.008-1.11.066-1.174.061-.067.152-.073 1.167-.073.968 0 1.11.008 1.174.066m14 0c.067.061.073.152.073 1.167 0 .968-.008 1.11-.066 1.174-.061.067-.152.073-1.167.073-.968 0-1.11-.008-1.174-.066-.067-.061-.073-.152-.073-1.167 0-.968.008-1.11.066-1.174.061-.067.152-.073 1.167-.073.968 0 1.11.008 1.174.066" fill-rule="evenodd"></path></svg>
	),
	hideAnimations: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.98 2.266c-.7.065-1.263.26-1.86.646-.242.157-3.724 3.595-4.041 3.991a4.019 4.019 0 0 0-.766 1.679c-.077.403-.077 6.433 0 6.836.111.588.401 1.224.766 1.679.317.396 3.799 3.834 4.041 3.991.469.303.962.505 1.464.6.4.075 6.432.075 6.832 0a4.107 4.107 0 0 0 1.464-.6c.242-.157 3.724-3.595 4.041-3.991a4.019 4.019 0 0 0 .766-1.679c.076-.402.077-6.433.001-6.834a3.993 3.993 0 0 0-.619-1.484c-.175-.262-3.567-3.696-3.972-4.021a4.091 4.091 0 0 0-1.562-.747c-.241-.058-.652-.067-3.335-.073a180.917 180.917 0 0 0-3.22.007m6.358 1.555c.545.142.584.175 2.625 2.216 1.58 1.581 1.924 1.944 2.026 2.143.256.496.251.418.251 3.82 0 3.402.005 3.324-.251 3.82-.102.199-.446.562-2.026 2.143-2.046 2.046-2.076 2.071-2.629 2.214-.363.093-6.313.095-6.672.002-.545-.142-.584-.175-2.625-2.216-2.041-2.041-2.074-2.08-2.216-2.625-.092-.352-.092-6.324 0-6.676.142-.545.175-.584 2.216-2.625 2.029-2.029 2.08-2.072 2.607-2.214.332-.089 6.353-.091 6.694-.002m.562 3.438a1.795 1.795 0 0 1-.16.04c-.091.02-1.119 1.024-4.212 4.113-2.25 2.249-4.13 4.149-4.177 4.224-.119.19-.117.541.005.738.176.284.484.409.833.338.186-.039.304-.152 4.301-4.145 2.349-2.347 4.138-4.164 4.175-4.242a.765.765 0 0 0-.249-.932c-.142-.098-.417-.169-.516-.134" fill-rule="evenodd"></path></svg>
	),
	highlightLinks: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.452 6.821c-1.416.259-2.595 1.015-3.339 2.14-.581.879-.837 1.726-.839 2.779-.002.844.139 1.459.505 2.205.721 1.468 2.074 2.466 3.718 2.744.184.032.812.049 1.803.05 1.341.001 1.534-.007 1.64-.065.242-.134.42-.419.42-.674a.886.886 0 0 0-.212-.513c-.212-.227-.197-.225-1.948-.249l-1.62-.022-.38-.128c-1.121-.377-1.923-1.179-2.284-2.288a3.75 3.75 0 0 1-.099-1.721c.14-.697.451-1.267.983-1.799.427-.427.794-.659 1.331-.843.494-.168.829-.197 2.299-.197 1.289 0 1.352-.004 1.52-.085.26-.126.39-.344.39-.655 0-.311-.13-.529-.39-.655-.17-.082-.223-.085-1.693-.081-1.064.003-1.603.02-1.805.057m7.595.025c-.258.127-.387.346-.387.654 0 .311.13.529.39.655.168.081.231.085 1.52.085 1.47 0 1.805.029 2.299.197.537.184.904.416 1.331.843.532.532.843 1.102.983 1.799a3.75 3.75 0 0 1-.099 1.721c-.361 1.109-1.163 1.911-2.284 2.288l-.38.128-1.62.022c-1.751.024-1.736.022-1.948.249a.886.886 0 0 0-.212.513c0 .255.178.54.42.674.106.058.299.066 1.64.065.991-.001 1.619-.018 1.803-.05.767-.129 1.614-.484 2.202-.921a4.935 4.935 0 0 0 2.021-4.026c-.003-1.057-.258-1.902-.839-2.781-.621-.939-1.674-1.709-2.738-2.001-.657-.18-.896-.2-2.449-.2-1.433 0-1.486.003-1.653.086m-6.232 4.432c-.484.115-.717.726-.432 1.13a.939.939 0 0 0 .277.248c.159.083.191.084 4.219.095 2.865.008 4.122-.002 4.274-.034.749-.155.777-1.244.036-1.431-.21-.052-8.155-.06-8.374-.008" fill-rule="evenodd"></path></svg>
	),
	slovenian: <FlagSI/>,
	english: <FlagGB/>,
};

function FlagSI() {
	return <img src={flagSI} alt="" aria-hidden="true" draggable="false" />;
}

function FlagGB() {
	return <img src={flagGB} alt="" aria-hidden="true" draggable="false" />;
}

export const LANGUAGES = [
	{code: 'en', label: 'English', Flag: FlagGB},
	...(SL_ENABLED ? [{code: 'sl', label: 'Slovenščina', Flag: FlagSI}] : []),
];

// External setter — lets other components (e.g. footer dropdown) change language
// without owning the a11y state. AccessibilityToggle listens for this event and
// re-broadcasts via the usual a11y:change cycle.
export function setA11yLanguage(lang) {
	window.dispatchEvent(new CustomEvent('a11y:set', {detail: {language: lang}}));
}

const TOGGLE_KEYS = {
	reading: [
		{key: 'bigCursor', labelKey: 'a11y.rows.bigCursor', icon: Icons.bigCursor},
		{key: 'letterSpacing', labelKey: 'a11y.rows.letterSpacing', icon: Icons.letterSpacing},
		{key: 'textCenter', labelKey: 'a11y.rows.textCenter', icon: Icons.textCenter},
		{key: 'bold', labelKey: 'a11y.rows.bold', icon: Icons.bold},
	],
	colors: [
		{key: 'lightContrast', labelKey: 'a11y.rows.lightContrast', icon: Icons.lightContrast},
		{key: 'highContrast', labelKey: 'a11y.rows.highContrast', icon: Icons.highContrast},
		{key: 'monochrome', labelKey: 'a11y.rows.monochrome', icon: Icons.monochrome},
	],
	orientation: [
		{key: 'readingLine', labelKey: 'a11y.rows.readingLine', icon: Icons.readingLine},
		{key: 'readingMask', labelKey: 'a11y.rows.readingMask', icon: Icons.readingMask},
		{key: 'hidePhotos', labelKey: 'a11y.rows.hidePhotos', icon: Icons.hidePhotos},
		{key: 'highlightContent', labelKey: 'a11y.rows.highlightContent', icon: Icons.highlightContent},
		{key: 'hideAnimations', labelKey: 'a11y.rows.hideAnimations', icon: Icons.hideAnimations},
		{key: 'highlightLinks', labelKey: 'a11y.rows.highlightLinks', icon: Icons.highlightLinks},
	],
};

const CLASS_MAP = {
	readingFont: 'a11y-reading-font',
	bigCursor: 'a11y-big-cursor',
	letterSpacing: 'a11y-letter-spacing',
	textCenter: 'a11y-text-center',
	bold: 'a11y-bold',
	lightContrast: 'a11y-light-contrast',
	highContrast: 'a11y-high-contrast',
	monochrome: 'a11y-monochrome',
	hidePhotos: 'a11y-hide-photos',
	highlightContent: 'a11y-highlight-content',
	hideAnimations: 'a11y-hide-animations',
	highlightLinks: 'a11y-highlight-links',
};

const COLOR_MODES = ['lightContrast', 'highContrast', 'monochrome'];

const DEFAULT_STATE = {
	language: 'en', // 'en' | 'sl'
	fontSize: 1,   // index into FONT_SIZES (1 = default size)
	lineHeight: 1, // index into LINE_HEIGHTS (1 = default)
	readingFont: false,
	bigCursor: false,
	letterSpacing: false,
	textCenter: false,
	bold: false,
	lightContrast: false,
	highContrast: false,
	monochrome: false,
	readingLine: false,
	readingMask: false,
	hidePhotos: false,
	highlightContent: false,
	hideAnimations: false,
	highlightLinks: false,
};

function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {...DEFAULT_STATE, language: detectLanguage()};
		const parsed = JSON.parse(raw);
		// Saved language wins; if absent, run detection so existing users with
		// pre-i18n a11y state still get browser-matched language.
		return {
			...DEFAULT_STATE,
			...parsed,
			language: (!SL_ENABLED && parsed.language === 'sl') ? 'en' : (parsed.language || detectLanguage()),
		};
	} catch {
		return {...DEFAULT_STATE, language: detectLanguage()};
	}
}

// Public hook — subscribe to a11y state from anywhere in the tree
export function useA11yState() {
	const [s, setS] = useState(loadState);
	useEffect(() => {
		const onChange = (e) => setS(e.detail);
		window.addEventListener('a11y:change', onChange);
		return () => window.removeEventListener('a11y:change', onChange);
	}, []);
	return s;
}

function applyClasses(state) {
	const html = document.documentElement;
	// Clear existing a11y classes
	[...html.classList]
		.filter(c => c.startsWith('a11y-'))
		.forEach(c => html.classList.remove(c));

	// Font size + line height classes
	html.classList.add(`a11y-fs-${state.fontSize}`);
	html.classList.add(`a11y-lh-${state.lineHeight}`);

	// Toggles
	Object.entries(CLASS_MAP).forEach(([key, cls]) => {
		if (state[key]) html.classList.add(cls);
	});
}

export default function AccessibilityToggle() {
	const [open, setOpen] = useState(false);
	const [state, setState] = useState(loadState);
	const [mouseY, setMouseY] = useState(0);
	const t = useT();

	// Persist + apply + broadcast
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		applyClasses(state);
		window.dispatchEvent(new CustomEvent('a11y:change', {detail: state}));
	}, [state]);

	// External state updates (e.g. language dropdown in footer)
	useEffect(() => {
		const onSet = (e) => setState((prev) => ({...prev, ...e.detail}));
		window.addEventListener('a11y:set', onSet);
		return () => window.removeEventListener('a11y:set', onSet);
	}, []);

	// Mouse tracker (only when reading line or mask is on)
	useEffect(() => {
		if (!state.readingLine && !state.readingMask) return;
		const onMove = (e) => setMouseY(e.clientY);
		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	}, [state.readingLine, state.readingMask]);

	// Close on Escape
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	const toggle = useCallback((key) => {
		setState((prev) => {
			const next = {...prev, [key]: !prev[key]};
			// Color modes are mutually exclusive
			if (COLOR_MODES.includes(key) && next[key]) {
				COLOR_MODES.forEach((k) => {
					if (k !== key) next[k] = false;
				});
			}
			return next;
		});
	}, []);

	const setFontSize = useCallback((delta) => {
		setState((prev) => {
			const next = Math.max(0, Math.min(FONT_SIZES.length - 1, prev.fontSize + delta));
			return {...prev, fontSize: next};
		});
	}, []);

	const setLineHeight = useCallback((delta) => {
		setState((prev) => {
			const next = Math.max(0, Math.min(LINE_HEIGHTS.length - 1, prev.lineHeight + delta));
			return {...prev, lineHeight: next};
		});
	}, []);

	const setLanguage = useCallback((lang) => {
		setState((prev) => ({...prev, language: lang}));
	}, []);

	const reset = useCallback(() => setState(DEFAULT_STATE), []);

	const maskHeight = 150;

	return createPortal(
		<>
			<button
				className="a11y-toggle-btn"
				aria-label={t('a11y.openLabel')}
				onClick={() => setOpen(true)}
			>
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="4" r="2" fill="currentColor"/>
					<path
						d="M3.5 8.5c1 0.4 4 1 8.5 1s7.5-0.6 8.5-1"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						d="M9 9v4l-2 8M15 9v4l2 8M12 13v3"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<div
				className={`a11y-overlay ${open ? 'is-open' : ''}`}
				onClick={() => setOpen(false)}
			/>

			<aside
				className={`a11y-panel ${open ? 'is-open' : ''}`}
				role="dialog"
				aria-label={t('a11y.heading')}
				aria-hidden={!open}
			>
				<div className="a11y-panel-header">
					<h2>{t('a11y.heading')}</h2>
					<button
						className="a11y-close-btn"
						aria-label={t('a11y.closeLabel')}
						onClick={() => setOpen(false)}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2"
								  strokeLinecap="round"/>
						</svg>
					</button>
				</div>

				<div className="a11y-panel-body">
					{/* Language — hidden entirely while only one language is live */}
					{LANGUAGES.length > 1 && (
						<div className="a11y-section a11y-section--lang">
							<div className="a11y-section-title">{t('a11y.sections.language')}</div>
							<Row
								label="English"
								icon={Icons.english}
								active={state.language === 'en'}
								onToggle={() => setLanguage('en')}
							/>
							{SL_ENABLED && (
								<Row
									label="Slovenščina"
									icon={Icons.slovenian}
									active={state.language === 'sl'}
									onToggle={() => setLanguage('sl')}
								/>
							)}
						</div>
					)}

					{/* Reading */}
					<div className="a11y-section">
						<div className="a11y-section-title">{t('a11y.sections.reading')}</div>

						<div className="a11y-row a11y-row-wide">
							<div className="a11y-row-head">
								<span className="a11y-row-icon" aria-hidden="true">{Icons.fontSize}</span>
								<span className="a11y-row-label">{t('a11y.rows.fontSize')}</span>
							</div>
							<div className="a11y-stepper">
								<button
									aria-label={t('a11y.stepper.decreaseFont')}
									onClick={() => setFontSize(-1)}
									disabled={state.fontSize === 0}
								>−
								</button>
								<span className="a11y-stepper-value">
                  {state.fontSize === 1 ? '0' : (state.fontSize < 1 ? '-1' : `${state.fontSize - 1}`)}
                </span>
								<button
									aria-label={t('a11y.stepper.increaseFont')}
									onClick={() => setFontSize(1)}
									disabled={state.fontSize === FONT_SIZES.length - 1}
								>+
								</button>
							</div>
						</div>

						<Row
							label={t('a11y.rows.readingFont')}
							icon={Icons.readingFont}
							active={state.readingFont}
							onToggle={() => toggle('readingFont')}
						/>

						<div className="a11y-row a11y-row-wide">
							<div className="a11y-row-head">
								<span className="a11y-row-icon" aria-hidden="true">{Icons.lineHeight}</span>
								<span className="a11y-row-label">{t('a11y.rows.lineHeight')}</span>
							</div>
							<div className="a11y-stepper">
								<button
									aria-label={t('a11y.stepper.decreaseLine')}
									onClick={() => setLineHeight(-1)}
									disabled={state.lineHeight === 0}
								>−
								</button>
								<span className="a11y-stepper-value">
                  {state.lineHeight === 1 ? '0' : (state.lineHeight < 1 ? '−1' : `+${state.lineHeight - 1}`)}
                </span>
								<button
									aria-label={t('a11y.stepper.increaseLine')}
									onClick={() => setLineHeight(1)}
									disabled={state.lineHeight === LINE_HEIGHTS.length - 1}
								>+
								</button>
							</div>
						</div>

						{TOGGLE_KEYS.reading.map((item) => (
							<Row key={item.key} label={t(item.labelKey)} icon={item.icon} active={state[item.key]} onToggle={() => toggle(item.key)}/>
						))}
					</div>

					{/* Colors */}
					<div className="a11y-section">
						<div className="a11y-section-title">{t('a11y.sections.colors')}</div>
						{TOGGLE_KEYS.colors.map((item) => (
							<Row key={item.key} label={t(item.labelKey)} icon={item.icon} active={state[item.key]} onToggle={() => toggle(item.key)}/>
						))}
					</div>

					{/* Orientation */}
					<div className="a11y-section">
						<div className="a11y-section-title">{t('a11y.sections.orientation')}</div>
						{TOGGLE_KEYS.orientation.map((item) => (
							<Row key={item.key} label={t(item.labelKey)} icon={item.icon} active={state[item.key]} onToggle={() => toggle(item.key)}/>
						))}
					</div>

					<button className="a11y-reset" onClick={reset}>
						{t('a11y.resetAll')}
					</button>
				</div>
			</aside>

			{state.readingLine && (
				<div
					className="a11y-reading-line"
					style={{top: `${mouseY}px`}}
					aria-hidden="true"
				/>
			)}

			{state.readingMask && (
				<>
					<div
						className="a11y-reading-mask-top"
						style={{top: 0, height: `${Math.max(0, mouseY - maskHeight / 2)}px`}}
						aria-hidden="true"
					/>
					<div
						className="a11y-reading-mask-bottom"
						style={{top: `${mouseY + maskHeight / 2}px`, bottom: 0}}
						aria-hidden="true"
					/>
				</>
			)}
		</>,
		document.body
	);
}

function Row({label, icon, active, onToggle}) {
	return (
		<button
			type="button"
			className={`a11y-row ${active ? 'active' : ''}`}
			role="switch"
			aria-checked={active}
			aria-label={label}
			onClick={onToggle}
		>
			<div className="a11y-row-head">
				{icon && <span className="a11y-row-icon" aria-hidden="true">{icon}</span>}
				<span className="a11y-row-label">{label}</span>
			</div>
		</button>
	);
}
