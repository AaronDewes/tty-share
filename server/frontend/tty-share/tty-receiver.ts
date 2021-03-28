import { Terminal, IEvent, IDisposable } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

import base64 from './base64';

interface IRectSize {
    width: number;
    height: number;
}

class TTYReceiver {
    private xterminal: Terminal;

    constructor(wsAddress: string, container: HTMLDivElement) {
        console.log("Opening WS connection to ", wsAddress)
        const connection = new WebSocket(wsAddress);

        // TODO: expose some of these options in the UI
        this.xterminal = new Terminal({
            cursorBlink: true,
            macOptionIsMeta: true,
            scrollback: 1000,
            fontSize: 16,
            letterSpacing: 0,
            fontFamily: 'SauceCodePro MonoWindows, courier-new, monospace',
        });

        const fitAddon = new FitAddon();
        this.xterminal.loadAddon(fitAddon);

        this.xterminal.open(container);

        fitAddon.fit();

        connection.onclose =  (evt: CloseEvent) => {

           this.xterminal.blur();
           this.xterminal.setOption('cursorBlink', false);
           this.xterminal.clear();

           setTimeout(() => {
            this.xterminal.write('Session closed');
           }, 1000)
        }

        this.xterminal.focus();

        connection.onmessage = (ev: MessageEvent) => {
          console.log("Got message: ", ev.data);

            let message = JSON.parse(ev.data)
            let msgData = base64.decode(message.Data)

            if (message.Type === "Write") {
                let writeMsg = JSON.parse(msgData)
                this.xterminal.write(base64.base64ToArrayBuffer(writeMsg.Data));
            }
        }

        this.xterminal.onData(function (data:string) {
            let writeMessage = {
                Type: "Write",
                Data: base64.encode(JSON.stringify({ Size: data.length, Data: base64.encode(data)})),
            }
            let dataToSend = JSON.stringify(writeMessage)
            connection.send(dataToSend);
        });

    }
}

export {
    TTYReceiver
}
