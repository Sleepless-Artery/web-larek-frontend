interface IComponent {
    toggleClass(element: HTMLElement, className: string): void;
    setHidden(element: HTMLElement): void;
    setVisible(element: HTMLElement): void;
    setText(element: HTMLElement, value: unknown): void;
    setImage(element: HTMLImageElement, src: string, alt?: string): void;
}

export abstract class Component<T> implements IComponent {
    constructor(protected container: HTMLElement) {};

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    };
    
    toggleClass(element: HTMLElement, className: string) {
        element.classList.toggle(className);
    }

    setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) 
                element.setAttribute('disabled', 'disabled');
            else 
                element.removeAttribute('disabled');
        }
    }

    setText(element: HTMLElement, value: unknown) {
        element.textContent = String(value);
    }

    setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt)
                element.alt = alt;
        }
    }
}