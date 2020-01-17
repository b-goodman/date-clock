var css = ":host{display:block;width:300px;height:300px}#face{width:inherit;height:inherit;border:1px solid #000;border-radius:300px;position:absolute}#face #center-dot{position:absolute;width:10px;height:10px;left:145px;top:140px;border-radius:10px;background:#000;z-index:4}#face .hand{position:absolute;left:150px;border:1px solid #000;background:grey;transform-origin:bottom center}#face #second-hand{top:5px;width:2px;height:140px;z-index:3}#face #minute-hand{top:5px;width:4px;height:140px;z-index:2}#face #hour-hand{top:40px;width:4px;height:100px;z-index:1}#face .major{border:3px solid #000}#face .second-pt{position:absolute;width:1px;height:5px;background:#000;transform-origin:center}";

class DateClock extends HTMLElement {
    constructor() {
        super();
        this.circlePt = (r, theta, origin = { x: 0, y: 0 }) => {
            return { x: (r * Math.cos(theta)) + origin.x, y: (r * Math.sin(theta)) + origin.y };
        };
        this.updateClock = () => {
            this.t++;
            this.secondHandRef.style.transform = `rotate(${(this.t % 60) / 60}turn)`;
            this.minuteHandRef.style.transform = `rotate(${(this.t % 3600) / 3600}turn)`;
            this.hourHandRef.style.transform = `rotate(${(this.t % 43200) / 43200}turn)`;
        };
        const template = document.createElement('template');
        template.innerHTML = `
            <style>${css}</style>
            <div id="face">
                <div id="center-dot"></div>
                <div id="hour-hand" class="hand"></div>
                <div id="second-hand" class="hand"></div>
                <div id="minute-hand" class="hand"></div>
            </div>
        `;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.clockFaceRef = shadowRoot.querySelector("#face");
        this.secondHandRef = shadowRoot.querySelector("#second-hand");
        this.minuteHandRef = shadowRoot.querySelector("#minute-hand");
        this.hourHandRef = shadowRoot.querySelector("#hour-hand");
        for (let i = 0; i < 60; i++) {
            const el = document.createElement("div");
            el.classList.add("second-pt");
            i % 5 === 0 ? el.classList.add("major") : el.classList.add("minor");
            const pos = this.circlePt(140, (i * (Math.PI / 30)), { x: 148, y: 146 });
            el.style.right = `${pos.x}px`;
            el.style.top = `${pos.y}px`;
            el.style.transform = `rotate(-${(i / 60) + 0.25}turn)`;
            this.clockFaceRef.appendChild(el);
        }
        const d = new Date();
        this.t = (d.getTime() - d.setHours(0, 0, 0, 0)) / 1000;
        this.intervalID = window.setInterval(this.updateClock, 1000);
    }
    static get observedAttributes() {
        return [];
    }
    connectedCallback() {
        this.updateClock();
    }
    disconnecetdCallback() {
        window.clearInterval(this.intervalID);
    }
}
window.customElements.define("date-clock", DateClock);

export default DateClock;
//# sourceMappingURL=index.js.map
