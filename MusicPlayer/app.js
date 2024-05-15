const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "KIM BAP CUTE";

const player = $(".player");
const cd = $(".cd");
const playlist = $(".playlist");
const audio = $("#audio");
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const btnRepeat = $('.btn-repeat');
const btnPrev = $('.btn-prev');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const progress = $('#progress');
const btnPlay = $('.btn-toggle-play');



const app = {
    currentIndex : 0,
    isPlaying : false,
    isRepeat : false,
    isRandom: false,
    songs : [
        {
            name: 'Buồn Hay Vui',
            singer: 'VSOUL, RPT MCK, Obito, V.A',
            path: './assets/music/song1.mp3',
            image: './assets/img/image1.jpg'
        },{
            name: 'NGTANOISE (Người Ta Nói Remake)',
            singer: 'VSOUL, Mfree,',
            path: './assets/music/song2.mp3',
            image: './assets/img/image2.jpg'
        },{
            name: 'Shawty',
            singer: 'VSOUL, Obito',
            path: './assets/music/song3.mp3',
            image: './assets/img/image3.jpg'
        },{
            name: 'Đã Từng',
            singer: 'VSOUL, tlinh',
            path: './assets/music/song4.mp3',
            image: './assets/img/image4.jpg'
        },{
            name: 'Bỏ Túi',
            singer: 'B Wine, VSOUL, RAP VIỆT',
            path: './assets/music/song5.mp3',
            image: './assets/img/image5.jpg'
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
              }" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
          `;
        });
        playlist.innerHTML = htmls.join("");
    },

    // xử lý khi scroll top
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý cd quya và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 giây
            iterations: 100,
        })
        cdThumbAnimate.pause();
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Play, pause, seek song

        // Xử lý khi click play
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
                
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // Khi song bị dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        cdThumbAnimate.pause();
        }
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            // console.log(audio.currentTime);
            if(audio.duration) {
                progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
            console.log(e.target.value);
            currentSongTime = e.target.value * audio.duration / 100;
            audio.currentTime = currentSongTime;
        }

        // Xử lý khi bấm vào nút next
        btnNext.onclick = function(e) {
            if(_this.isRandom) {
                _this.randomSong();
            }else _this.nextSong();

            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }



        // Xửa lý khi bấm vào nút pre
        btnPrev.onclick = function(e) {
            if(_this.isRandom) {
                _this.randomSong();
            }else _this.prevSong();

            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        // Xử lý khi bấm vào nút random
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            // if(_this.isRandom) { 
            //     btnRandom.classList.add('active');
            // } else {
            //     btnRandom.classList.remove('active');
            // }
            // Cách nâng cao hơn
            btnRandom.classList.toggle('active', _this.isRandom);

        }

        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat) {
                audio.play();
            }else btnNext.click();
        };

        // Xử lý repeat bài hát
        btnRepeat.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }

        // Chuyển bài hát khi click vào một số vùng trong playlist
    playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active');
        if (songNode || e.target.closest('.option')) {
            // play song được click vào
            if (e.target.closest('.song:not(.active')) {
                const songIndex = Number(songNode.dataset.index);
                _this.currentIndex = songIndex;
                _this.loadCurrentSong();
                _this.render();
                audio.play();
                
            }
            // Xử lý khi click vào song option
            if(e.target.closest('.option')) {

            }
        } 
    }

        
    },
    // settings config
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        btnRandom.classList.toggle('active', this.isRandom);
        this.isRepeat = this.config.isRepeat;
        btnRepeat.classList.toggle('active', this.isRepeat);

    },

    // Định nghĩa các thuộc tính
    defineProperty: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    // Tải bài tiếp theo
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    // Tải bài phía trước
     prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },

    // Random danh sách bài hát
    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // Xử lý khi chạy tới bài hát đang phát
    scrollToActiveSong : function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                inline: 'nearest'
            });
        }, 300)
    },
    start: function() {   
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig(); 
        // Định nghĩa các thuộc tính

        this.defineProperty();

        // Lắng nghe xử lý các sự kiên
        this.handleEvents();
        
        // Render bài hát đầu tiên khi tải ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }

    
}

app.start();
