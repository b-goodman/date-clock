declare class DateClock extends HTMLElement {
    static get observedAttributes(): never[];
    constructor();
    connectedCallback(): void;
    disconnecetdCallback(): void;
    private circlePt;
    private clockFaceRef;
    private secondHandRef;
    private minuteHandRef;
    private hourHandRef;
    private t;
    private intervalID;
    private updateClock;
}

export default DateClock;
