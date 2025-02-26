const api = "http://216.250.11.75:5055";
//const api = "http://diwan-api.pikir.biz"
let mainLang = localStorage.getItem("lang") ?? "ru";
function changeLang(value) {
  localStorage.setItem("lang", value);
  mainLang = value;
}

function CSRFGet() {
  if (!sessionStorage.getItem("csrf")) {
    fetch(api + "/api/csrf-token", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        localStorage.getItem("test", JSON.stringify(responseData));
        sessionStorage.setItem("csrf", responseData.token);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

CSRFGet();

const app = Vue.createApp({
  data() {
    return {
      lang: mainLang,
      pages: [],
      rooms: [],
      galleries: [],
      sliders: [],
      generalInfo: {},
      menus: [],
    };
  },
  beforeCreate() {
    axios.get(`${api}/api/generalinfo`).then((result) => {
      this.generalInfo = result.data;
    });
    axios.get(`${api}/api/pages`).then((result) => {
      this.pages = result.data;
    });
    axios.get(`${api}/api/sliders`).then((result) => {
      this.sliders = result.data;
    });
  },
  mounted() {
    this.$nextTick(() => {
      axios.get(`${api}/api/teams`).then((result) => {
        this.rooms = result.data;
      });
      axios.get(`${api}/api/galleries`).then((result) => {
        this.galleries = result.data;
      });
      axios.get(`${api}/api/products`).then((result) => {
        this.menus = result.data;
      });
    });
  },

  computed: {
    computedLang() {
      return messages[this.lang].lang;
    },
    messageCom() {
      return messages[this.lang];
    },
    computedGeneralInfo() {
      return {
        name: this.generalInfo.name,

        phone: this.generalInfo.phone_number
          ? this.generalInfo.phone_number.split("/")
          : "",
        address: this.generalInfo["address_" + this.lang],
        email: this.generalInfo.email ? this.generalInfo.email.split("/") : "",
        logo: `${api}/images/${this.generalInfo.logo}`,
        logoWhite: `${api}/images/${this.generalInfo.logo_secondary}`,
      };
    },
    computedNavList() {
      let custom = {};
      this.pages.map((item) => {
        custom[item["type"]] = item["name_" + this.lang];
      });
      return custom;
    },
    showNavbar() {
      if (Object.keys(this.computedNavList).length > 0) {
        return true;
      } else {
        return false;
      }
    },

    computedSliders() {
      return this.sliders.map((item) => {
        return `${api}/images/${item.url}`;
      });
    },

    computedAboutPage() {
      const menu = this.pages.find((item) => item.type === "about") ?? {};
      if (Object.keys(menu).length > 0) {
        return {
          name: menu[`name_${this.lang}`],
          customTitle: menu[`title_${this.lang}`],
        };
      }
    },
    computedGalleryPage() {
      const gallery = this.pages.find((item) => item.type === "gallery") ?? {};
      if (Object.keys(gallery).length > 0) {
        return {
          name: gallery[`name_${this.lang}`],
          customTitle: gallery[`title_${this.lang}`],
        };
      }
    },
    computedRoomPage() {
      const room = this.pages.find((item) => item.type === "room") ?? {};
      if (Object.keys(room).length > 0) {
        return {
          name: room[`name_${this.lang}`],
          customTitle: room[`title_${this.lang}`],
        };
      }
    },
    computedMenus() {
      let custom = [];
      for (let i = 0; i < this.menus.length; i++) {
        const item = this.menus[i];
        custom.push({
          name: item["name_" + this.lang],
          price: item["price"],
          url: `${api}/images/${item["url"]}`,
        });
      }
      return custom;
    },

    computedRooms() {
      let custom = [];
      for (let i = 0; i < this.rooms.length; i++) {
        const item = this.rooms[i];
        custom.push({
          name: item["name_" + this.lang],
          capacity: item["capacity"],
          size: item["size"],
          price: item["price"],
          url: `${api}/images/${item["url"]}`,
        });
      }
      return custom;
    },
    computedIndexRooms() {
      let custom = [];
      const looplen =
        this.rooms && this.rooms.length > 3 ? 3 : this.rooms.length;
      for (let i = 0; i < looplen; i++) {
        const item = this.rooms[i];
        custom.push({
          name: item["name_" + this.lang],
          capacity: item["capacity"],
          size: item["size"],
          price: item["price"],
          url: `${api}/images/${item["url"]}`,
        });
      }
      return custom;
    },
    computedInstaGalleries() {
      let custom = [];
      if (this.galleries && this.galleries.length) {
        const instagram =
          this.galleries.filter(
            (item) => item.galleryType.type === "instagram"
          ) ?? [];
        const looplen = instagram.length > 9 ? 9 : instagram.length;
        for (let i = 0; i < looplen; i++) {
          const item = instagram[i];
          custom.push(`${api}/images/${item["url"]}`);
        }
      }
      return custom;
    },
    computedGalleries() {
      let custom = [];
      if (this.galleries && this.galleries.length) {
        const customGallery =
          this.galleries.filter(
            (item) => item.galleryType.type !== "instagram"
          ) ?? [];
        for (let i = 0; i < customGallery.length; i++) {
          const item = customGallery[i];
          custom.push(`${api}/images/${item["url"]}`);
        }
      }
      return custom;
    },
  },
  methods: {
    toogleMobileNav() {
      const elMobile = document.getElementById("mobileMenuId");
      const langMobile = elMobile.getElementsByClassName("lang__list")[0];
      langMobile.style.display = "flex";
    },
    changeLang(value) {
      localStorage.setItem("lang", value);
      this.lang = value;
      window.location.reload();
      // if (this.$refs.dropdownRef) {
      //     this.$refs.dropdownRef.checked = false
      // }
      // const body = document.getElementsByTagName("body")[0]
      // if (body.classList.contains("mobile-menu-visible")) {
      //     this.$refs.closeBtn.click()
      // }
    },
    sendEmail() {
      let fullname = this.$refs.fullname.value;
      let email = this.$refs.email.value;
      let guests = this.$refs.guests.value;
      let date = this.$refs.date.value;
      let message = this.$refs.message.value;

      const data = {
        fullname: fullname,
        email: email,
        guests: guests,
        date: date,
        message: message,
      };
      let error = false;
      for (const key in data) {
        const element = data[key];
        if (element === "" && key !== "message") {
          this.$refs[key].style.borderColor = "red";
          this.$refs.requiredTag.style.display = "flex";
          error = true;
        }
      }
      if (error === false) {
        this.$refs.requiredTag.style.display = "none";
        this.$refs.btnText.style.display = "none";
        this.$refs.btnLoading.style.display = "inline-block";
        axios
          .post(`${api}/api/EmailSender/SendEmail`, data, {
            headers: { "X-CSRF-Token": sessionStorage.getItem("csrf") },
          })
          .then((result) => {
            this.$refs.successTag.style.display = "flex";
            this.$refs.btnLoading.style.display = "none";
            this.$refs.btnText.style.display = "block";
            for (const key in data) {
              this.$refs[key].value = "";
            }
            setTimeout(() => {
              this.$refs.successTag.style.display = "none";
            }, 5000);
          })
          .catch(() => {
            this.$refs.errorTag.style.display = "flex";
            this.$refs.btnLoading.style.display = "none";
            this.$refs.btnText.style.display = "block";
            setTimeout(() => {
              this.$refs.errorTag.style.display = "none";
            }, 5000);
          });
      }
    },
  },
});
app.mount("#app");
