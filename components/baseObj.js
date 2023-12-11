const defaultProps = {
    templateUrl: '',
    classNames: ['']
}

class baseObj extends HTMLElement {
    constructor(props = defaultProps) {
        super();

        this.wrapper = document.createElement('div');
        props.classNames.forEach(f => f ? this.wrapper.classList.add(f) : undefined);

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(this.wrapper);

        this.contentReady = () => props?.readyCallBack ? props.readyCallBack() : undefined;

        if (props.templateUrl) {
            fetch(props.templateUrl, { headers: { accept: 'text/html' }})
            .then(d => d.text())
            .then(d => {
                this.wrapper.innerHTML = d;
                this.contentReady();
            });
        }
        else {
            this.contentReady();
        }
    }

    connectedCallback() {
        // mediatorService.subscribe
    }

    disconnectedCallback() {
        // console.log('disconnectedCallback');
    }

    adoptedCallback() {
        // console.log('adoptedCallback');
    }

    attributeChangedCallback() {
        // console.log('attributeChangedCallback');
    }
}

export default baseObj;
