export class ModalHandler {
    static modalClosedEventHandler = null;
    static displayModal(header, body, footer, modalClosedEventHandler = null) {
        let htmlString = `<div id="modal">
                  <div id="modal-box">
                  <div id="modal-header">${header}</div>
                  <div id="modal-body">${body}</div>
                  <div id="modal-footer">${footer}</div>
                  </div></div>`;
        // Insert at end of page content which is in <main></main>
        document.querySelector('main').insertAdjacentHTML('beforeend', htmlString);

        this.modalClosedEventHandler = modalClosedEventHandler;

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
