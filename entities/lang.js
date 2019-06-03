class Lang {
    //TEMP
    static TYPES = [
        'english',
        'deutsch',
        'polish',
        'franch',
        'spanish'
    ];

    //TODO
    static LEVELS = [
        
    ];

    static DEFAULT_ATTRIBUTES = {
        id: "0",
        name: "USER",
    };

    constructor(attributes) {
        const {
            id,
            name
        } = Object.assign({}, User.DEFAULT_ATTRIBUTES, attributes);
        this.id = id;
        this.name = name;
    };
};

export default Lang;