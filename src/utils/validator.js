

export const emailValidator = (email) => {
        const regex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
        return regex.test(email);
    }

export const urlValidator = (url) => {
        const regex = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        return regex.test(url);
    }
