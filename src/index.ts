import style from "./index.scss";

export default class DateClock extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${style}</style>
            <div id="face">
                <div id="center-dot"></div>
                <div id="hour-hand" class="hand"></div>
                <div id="second-hand" class="hand"></div>
                <div id="minute-hand" class="hand"></div>
            </div>
        `;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.clockFaceRef = shadowRoot.querySelector<HTMLDivElement>("#face")!;
        this.secondHandRef = shadowRoot.querySelector<HTMLDivElement>("#second-hand")!;
        this.minuteHandRef = shadowRoot.querySelector<HTMLDivElement>("#minute-hand")!;
        this.hourHandRef = shadowRoot.querySelector<HTMLDivElement>("#hour-hand")!;

          // add tick marks
        for ( let i = 0; i<60; i++) {
            const el = document.createElement("div");
            el.classList.add("second-pt");
            // every 5th tick is a major mark (bold)
            i % 5 === 0 ? el.classList.add("major") : el.classList.add("minor");
            // get x,y coords of ticks
            const pos = this.circlePt(140, (i*(Math.PI/30)), {x: 148, y: 146} );
            el.style.right = `${pos.x}px`;
            el.style.top = `${pos.y}px`;
            el.style.transform = `rotate(-${(i/60) + 0.25}turn)`
            this.clockFaceRef.appendChild(el);
        };

          // time in seconds since midnight
        const d = new Date();
        this.t = (d.getTime() - d.setHours(0,0,0,0))/1000;

        this.intervalID = window.setInterval( this.updateClock, 1000);
    }

    // attributeChangedCallback(name: string, _oldVal: string, newVal: string) {}

    connectedCallback() {
        this.updateClock();
    }

    disconnecetdCallback() {
        window.clearInterval(this.intervalID);
    }

    // gets the x,y carteseian coord of a point on a circle centered at origin={x: 0, y:0} of radius r at theta radians from the x axis.
    private circlePt = (r: number, theta: number, origin={x: 0, y:0}) => {
        return {x: (r * Math.cos(theta)) + origin.x , y: (r * Math.sin(theta)) + origin.y}
    };

    private clockFaceRef: HTMLDivElement;
    private secondHandRef: HTMLDivElement;
    private minuteHandRef: HTMLDivElement
    private hourHandRef: HTMLDivElement;

    private t: number;
    private intervalID: number;


    private updateClock = () => {
        this.t++;
        // 60s per rotation
        this.secondHandRef.style.transform = `rotate(${(this.t%60)/60}turn)`;
        // 60s/min * 60min = 3600s per rotation => 1/3600 rot/s
        this.minuteHandRef.style.transform = `rotate(${(this.t%3600)/3600}turn)`;
        // 12hr * 60min/hr * 60s/min = 43200s per rotation => 1/43200 rot/s
        this.hourHandRef.style.transform = `rotate(${(this.t%43200)/43200}turn)`;
    };


}

window.customElements.define("date-clock", DateClock);

