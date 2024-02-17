export class ModalHandler {
    static modalClosedEventHandler = null;

/**
 * Displays a modal on the screen.
 *
 * @param {string} header - The header content of the modal.
 * @param {string} body - The body content of the modal.
 * @param {string} [footer=''] - The footer content of the modal.
 * @param {null|function} [modalClosedEventHandler=null] - The event handler to be called when the modal is closed. Default is null.
 * @param {null|string} [modalClass=false] - The CSS class to be added to the modal. Default is false, which means no class will be added.
 */
static displayModal(header, body, footer = '', modalClosedEventHandler = null, modalClass = null) {
    // Construct the HTML string for the modal
    let htmlString = `<div id="modal" class="${modalClass ? modalClass : ''}">
              <div id="modal-box">
              <div id="modal-header">${header}<span id="close-modal" style="float: right; cursor: pointer;">×</span></div>
              <div id="modal-body">${body}</div>
              ${footer ? `<div id="modal-footer">${footer}</div>` : ''}
              </div></div>`;
    // Insert the modal at the end of the page content which is in <main></main>
    document.querySelector('main').insertAdjacentHTML('beforeend', htmlString);

    // Store the event handler to be called when the modal is closed
    this.modalClosedEventHandler = modalClosedEventHandler;

    // Add event listeners to close the modal
    this.addCloseModalEventListeners();
}

    static closeModal() {
        let modal = document.getElementById('modal');
        // Event listeners don't need to be removed as entire dom element is removed
        modal?.remove();
    }

    static addCloseModalEventListeners() {
        // Event delegation. Add event listeners to non-existent elements during page loads but loaded dynamically
        // more on https://stackoverflow.com/a/34896387/9013718
        document.addEventListener('click', this.closeBtnClickHandler.bind(this));

        document.addEventListener('click', this.closeModalFromClickOutsideHandler.bind(this));
    }

    static closeModalAndCallGivenEventHandler(){
        this.closeModal();
        // Execute modal closed event handler only if it was closed via close button or click outside modal
        if (this.modalClosedEventHandler){
            this.modalClosedEventHandler();
        }
    }

    static closeBtnClickHandler(e) {
        // Hide modal when close-modal button is clicked
        if (e.target && e.target.id === 'close-modal') {
            this.closeModalAndCallGivenEventHandler();
        }
    }

    static closeModalFromClickOutsideHandler(e) {
        if (e.target && e.target === document.getElementById('modal')) {
            this.closeModalAndCallGivenEventHandler();
        }
    }

}
