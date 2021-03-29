import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

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
            let msgData = atob(message.Data)

            if (message.Type === "Write") {
                let writeMsg = JSON.parse(msgData)
                this.xterminal.write(atob(writeMsg.Data));
            }
        }

        this.xterminal.onData(function (data:string) {
            let writeMessage = {
                Type: "Write",
                Data: btoa(JSON.stringify({ Size: data.length, Data: btoa(data)})),
            }
            let dataToSend = JSON.stringify(writeMessage)
            connection.send(dataToSend);
        });

    }
}

export {
    TTYReceiver
}
