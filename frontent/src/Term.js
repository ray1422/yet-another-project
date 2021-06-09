import React, { Component, useEffect, useRef } from 'react'
import Terminal from 'react-console-emulator'
import conf from "./config"

function Matrix(props) {
    const ref = useRef(null)
    useEffect(() => {
        if (!props.stat) return
        const CANVAS = ref.current;
        const CTX = CANVAS.getContext("2d"),
            W = window.innerWidth,
            H = window.innerHeight,
            FONT_SIZE = 10,
            NUM_COLS = W / FONT_SIZE,
            TEXT_COLOR = "#0f0",
            COLS = [];


        class Col {
            constructor(x) {
                this.x = x;
                this.initY = 0;
                this.y = this.initY;
                this.currLoop = this.newLoop();
            }
            newLoop() {
                return Math.random() * (H - this.initY);
            }
            draw() {
                const CHARACTER = String.fromCharCode((33 + Math.random() * 93) | 0);
                CTX.font = FONT_SIZE + "px monospace";
                CTX.fillStyle = TEXT_COLOR;
                CTX.fillText(CHARACTER, this.x, this.y);
                this.y += FONT_SIZE;
                if (Math.abs(this.y - this.initY) > this.currLoop) {
                    this.y = this.initY;
                    this.currLoop = this.newLoop();
                }
            }
        }

        const clear = () => {
            CTX.fillStyle = "rgba(0,0,0,0.05)";
            CTX.fillRect(0, 0, W, H);
        };

        const loop = () => {
            clear();
            for (let i = 0; i < COLS.length; i++) COLS[i].draw();
            requestAnimationFrame(loop);
        };

        const createCols = () => {
            for (let i = 0; i < NUM_COLS; i++) COLS.push(new Col(i * FONT_SIZE));
        };

        (() => {
            CANVAS.width = W;
            CANVAS.height = H;
            createCols();
            loop();
        })();

    })
    if (props.stat) {
        setTimeout(() => {
            window.onkeydown = props.stopMat
        }, 300)
        return <canvas style={{
            position: 'fixed',
            top: 0,
            left: 0,
        }} ref={ref}
        />
    }
    window.onkeydown = null
    return <></>
}

class Term extends Component {
    constructor(props) {
        super(props)
        this.state = {
            matrix: false
        }
        this.terminal = React.createRef()
    }

    // Experimental syntax, requires Babel with the transform-class-properties plugin
    // You may also define commands within render in case you don't have access to class field syntax
    commands = {
        echo: {
            description: 'Echo a passed string.',
            usage: 'echo <string>',
            fn: (...args) => args.join(' ')
        },
        matrix: {
            description: "matrix",
            usage: "matrix",
            fn: () => {
                this.setState({ matrix: true })
            }
        },
        test: {
            description: 'test',
            usage: 'test',
            fn: (...args) => ""
        },
        cmt: {
            description: 'view or add comment.',
            usage: 'cmt list\n'
                + 'cmt add <name> <content>',
            fn: (...args) => {
                const terminal = this.terminal.current
                console.log(args)
                if (args.length === 0) {
                    return this.commands.cmt.usage
                }
                if (args.length >= 3 && args[0] === "add") {
                    const author = args[1];
                    const content = args.slice(2).join(" ");
                    const data = {
                        'author': author,
                        'content': content
                    };
                    fetch(`${conf.URL}/api/comments/`, {
                        body: JSON.stringify(data), // must match 'Content-Type' header
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'include', // include, same-origin, *omit
                        headers: {
                            'content-type': 'application/json'
                        },
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, cors, *same-origin
                        redirect: 'follow', // manual, *follow, error
                        referrer: 'no-referrer', // *client, no-referrer
                    }).then(response => {
                        terminal.pushToStdout(`${response.status} ${response.statusText}`)
                        return response.json()
                    }).then(dat => {
                        terminal.pushToStdout(JSON.stringify(dat))
                    })
                } else if (args.length === 1) {
                    if (args[0] !== "list") {
                        return this.commands.cmt.usage
                    } else {
                        terminal.lock = true
                        fetch(`${conf.URL}/api/comments/`).then(e => e.json()).then(data => {
                            console.log(data);
                            for (let i = 0; i < data.length; i++) {
                                const dat = data[i];
                                terminal.pushToStdout(`ㅤ\n${dat['author']} ${dat['created_at']}`)
                                terminal.pushToStdout(`${dat['content']}`)
                                terminal.pushToStdout(`ㅤ\r\nㅤ`)

                            }
                        }).catch(e => {
                            terminal.pushToStdout("Something went wrong!")
                            terminal.pushToStdout(e.toString())
                        }).finally(() => {
                            terminal.lock = false
                        })
                        return "wait for results..."
                    }
                } else {
                    return "invalid arguments!"
                }
            }
        }
    }

    render() {

        return (
            <>
                <Terminal
                    ref={this.terminal} // Assign ref to the terminal here
                    commands={this.commands}
                    welcomeMessage={'YAP - Yet Another Project'}
                    promptLabel={'user@yap:~$'}
                    style={{
                        borderRadius: 0,
                        minHeight: '100vh'
                    }}
                />
                <Matrix stat={this.state.matrix} stopMat={() => { this.setState({ matrix: false }); }}></Matrix>
            </>
        )
    }
}

export default Term