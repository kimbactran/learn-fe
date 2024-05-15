const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function toast({
    title = '', 
    message = '',
    type = 'info',
    duration = 300
}){
    const main = document.getElementById('toast');
    if (main) {
         
        const toast = document.createElement("div");
        // remove after 4s
        const autoRemoveId = setTimeout(function(){
            main.removeChild(toast)
        }, duration + 1000);
        //remove toast when click
        toast.onclick = function(e) {
            if (e.targer.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        }
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-circle-exclamation',
        }
         const icon = icons[type];
         const delay = (duration / 1000).toFixed(2);
         toast.style.animation = `slideInLeft ease 0.4s, fadeOut linear 1s ${delay}s forwards`;
        toast.classList.add('toast', `toast__${type}`);
        toast.innerHTML = `
                <div class="toast__icon">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="toast__body">
                    <h3 class="toast__title">${title}</h3>
                    <p class="toast__message">${message}</p>
                </div>
                <div class="toast__close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            `;
        main.appendChild(toast);

        
    }
}



function showSuccessToast() {
    toast({
        title: 'Success',
        message: 'Thành công!',
        type: 'success',
        duration: 3000 // Hiện ra 3s rồi ẩn
    })
}

function showErrorToast(){
    toast({
        title: 'Error',
        message: 'Đã xảy ra lỗi.',
        type: 'error',
        duration: 3000 // Hiện ra 3s rồi ẩn
    })
}