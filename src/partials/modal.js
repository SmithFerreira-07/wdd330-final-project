export function createModal() {
  return `
    <div
      id="recipe-modal"
      class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center p-4 z-50"
    >
      <div
        id="modal-content"
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
      </div>
    </div>
  `;
}

export function renderModal(containerId = "modal-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = createModal();
  }
}

export function showModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function hideModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function setModalContent(content) {
  const modalContent = document.getElementById("modal-content");
  if (modalContent) {
    modalContent.innerHTML = content;
  }
}
