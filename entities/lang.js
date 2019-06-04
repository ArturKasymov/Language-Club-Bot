class Lang {
    
    constructor(attributes) {
        const {
            id,
            name
        } = Object.assign({}, {
            id: "0",
            name: "USER",
        }, attributes);
        this.id = id;
        this.name = name;
    };
};

export default Lang;