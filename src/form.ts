import { LitElement, html, customElement, property } from 'lit-element';
import { query } from 'lit/decorators/query.js';
import { ifDefined } from 'lit/directives/if-defined.js';

function hasProperty<T extends unknown, TProp extends string>(
  value: T,
  prop: TProp
): value is T & Record<TProp, unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    Object.hasOwnProperty.call(value, prop)
  );
}

@customElement('t-form')
export class TFormElement extends LitElement {
  @property({ type: String })
  form?: string;

  @property({ type: String, reflect: true })
  name = '';

  @property({ type: String })
  value = '';

  static get formAssociated() {
    return true;
  }
  private internals = this.attachInternals();

  updateValue(event: InputEvent) {
    const target = event.target;

    if (target && hasProperty(target, 'value')) {
      const value = target.value as string;
      this.value = value;
      this.internals.setFormValue(value);
    }
  }

  firstUpdated() {
    if (this.internals) {
      this.internals.setFormValue(this.value);
    }
  }

  render() {
    return html`
        <t-input name="${this.name}" @input="${this.updateValue}"></t-input>
        <slot></slot>      
    `;
  }
}

@customElement('t-input')
export class TInputElement extends LitElement {
  static get formAssociated() {
    return true;
  }
  private internals = this.attachInternals();

  @property({ type: String, reflect: true })
  form?: string;

  @property({ type: Boolean, reflect: true })
  required = true;

  @query('input')
  inputField?: HTMLInputElement;

  @property({ type: String })
  name = '';

  @property({ type: String })
  value?: string;

  updateValue(event: InputEvent) {
    const target = event.target;

    if (target && hasProperty(target, 'value')) {
      const value = target.value as string;
      this.value = value;
      this.internals.setFormValue(value);
    }
  }

  firstUpdated() {
    if (this.value) {
      this.internals.setFormValue(this.value);
    }
  }

  render() {
    return html`
      <input 
        name=${ifDefined(this.name)}
        form=${ifDefined(this.form)} 
        required=${ifDefined(this.required)}
        value=${ifDefined(this.value)} 
        @input="${this.updateValue}" 
      />
    `;
  }
}
