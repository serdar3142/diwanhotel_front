const api = "http://localhost:5051"
// const api = "http://api-madoweb.pikir.biz"
const mainLang = localStorage.getItem("lang") ?? "tk"

const app = Vue.createApp({
    data() {
        return {
            lang: mainLang,
            pages: [],
            rooms: [],
            galleries: [],
            sliders: [],
            generalInfo: {},

        }
    },
    beforeCreate() {
        axios.get(`${api}/api/generalinfo`).then(result => {
            this.generalInfo = result.data
        })
        axios.get(`${api}/api/pages`).then(result => {
            this.pages = result.data
        })
        axios.get(`${api}/api/sliders`).then(result => {
            this.sliders = result.data
        })

    },
    mounted() {
        this.$nextTick(() => {
            axios.get(`${api}/api/teams`).then(result => {
                this.rooms = result.data
            })
            axios.get(`${api}/api/galleries`).then(result => {
                this.galleries = result.data
            })
        })
    },


    computed: {
        computedLang() {
            return messages[this.lang].lang
        },

        messageCom() {
            return messages[this.lang];
        },
        computedGeneralInfo() {
            return {
                name: this.generalInfo.name,

                phone: this.generalInfo.phone_number ? this.generalInfo.phone_number.split("/") : "",
                address: this.generalInfo['address_' + this.lang],
                email: this.generalInfo.email ? this.generalInfo.email.split("/") : "",
                logo: `${api}/images/${this.generalInfo.logo}`,
                logoWhite: `${api}/images/${this.generalInfo.logo_secondary}`

            }
        },
        computedNavList() {
            let custom = {}
            this.pages.map(item => {
                custom[item["type"]] = item['name_' + this.lang]
            })
            return custom
        },
        computedSliders() {
            return this.sliders.map(item => {
                return `${api}/images/${item.url}`
            })
        },
        computedRoomPage() {
            const room = this.pages.find(item => item.type === 'room') ?? {}
            if (Object.keys(room).length > 0) {
                return {
                    name: room[`name_${this.lang}`],
                    customTitle: room[`title_${this.lang}`],
                }
            }
        },
        computedRooms() {
            let custom = []
            const looplen = this.rooms && this.rooms.length > 3 ? 3 : this.rooms.length
            for (let i = 0; i < looplen; i++) {
                const item = this.rooms[i];
                custom.push({
                    name: item['name_' + this.lang],
                    capacity: item['capacity'],
                    size: item['size'],
                    price: item['price'],
                    url: `${api}/images/${item['url']}`
                })
            }
            return custom
        },
        computedGalleries() {
            let custom = []
            if (this.galleries && this.galleries.length) {
                const customGallery = this.galleries.filter(item => item.galleryType.type !== 'instagram') ?? []
                for (let i = 0; i < customGallery.length; i++) {
                    const item = customGallery[i];
                    custom.push(
                        `${api}/images/${item['url']}`
                    )
                }
            }
            return custom
        },
        computedInstaGalleries() {
            let custom = []
            if (this.galleries && this.galleries.length) {
                const instagram = this.galleries.filter(item => item.galleryType.type === 'instagram') ?? []
                const looplen = instagram.length > 9 ? 9 : instagram.length
                for (let i = 0; i < looplen; i++) {
                    const item = instagram[i];
                    custom.push(
                        `${api}/images/${item['url']}`
                    )
                }
            }
            return custom
        },
    },
    methods: {
        changeLang(value) {
            localStorage.setItem("lang", value)
            this.lang = value
            if (this.$refs.dropdownRef) {
                this.$refs.dropdownRef.checked = false
            }

        },
    },
});
app.mount('#gallery');

