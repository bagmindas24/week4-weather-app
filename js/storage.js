export const Storage = {
    getFavourites() {
        return JSON.parse(localStorage.getItem('favourites')) || [];
    },

    saveFavourite(city) {
        const favs = this.getFavourites();
        if (!favs.includes(city)) {
            favs.push(city);
            localStorage.setItem('favourites', JSON.stringify(favs));
        }
    },

    removeFavourite(city) {
        const favs = this.getFavourites().filter(c => c !== city);
        localStorage.setItem('favourites', JSON.stringify(favs));
    }
};