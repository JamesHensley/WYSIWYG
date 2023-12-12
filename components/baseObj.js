const defaultProps = {
    templateUrl: '',
    classNames: ['']
}

class baseObj extends HTMLElement {
    constructor(props = defaultProps) {
        super();

        // Since the stylesheet link will be appended to the document head, the link
        //   should be relative to the document root 
        if (props.docCss) {
            const sht = document.createElement('link');
            sht.rel = 'stylesheet';
            sht.type = 'text/css';
            sht.href = props.docCss;
            document.head.appendChild(sht);
        }

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
