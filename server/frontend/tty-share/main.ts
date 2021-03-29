import 'xterm/css/xterm.css';
import './main.css';

import * as pbkdf2 from 'pbkdf2';

import { TTYReceiver } from './tty-receiver';


const derivedKey = pbkdf2.pbkdf2Sync('password', 'salt', 4096, 32, 'sha256');
console.log(derivedKey);

let wsAddress = "";
if (window.location.protocol === "https:") {
   wsAddress = 'wss://';
} else {
    wsAddress = "ws://";
}

class TTYWindow extends Window {
    ttyInitialData?: {
        wsPath: string;
    };
}
let ttyWindow = window as TTYWindow;
wsAddress += ttyWindow.location.host + ttyWindow.ttyInitialData.wsPath;


new TTYReceiver(wsAddress, document.getElementById('terminal') as HTMLDivElement);
