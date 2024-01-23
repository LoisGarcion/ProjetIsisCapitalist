module.exports = {
    "name": "Zaun Capitalist",
    "logo": "icones/logomonde.jpg",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [
        {
            "id": 1,
            "name": "Sbire mage",
            "logo": "icones/sbiremage.jpg",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Nom du premier palier",
                    "logo": "icones/premierpalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Nom deuxième palier",
                    "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Nom troisième palier",
                    "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                    "seuil": 250,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "gain",
                    "unlocked": false
                }
                //...
        ]},
        {
        "id": 2,
        "name": "Sbire cannon",
        "logo": "icones/sbirecannon.jpg",
        "cout": 50,
        "croissance": 1.07,
        "revenu": 20,
        "vitesse": 2000,
        "quantite": 0,
        "timeleft": 0,
        "managerUnlocked": false,
        "palliers": [
            {
                "name": "Nom du premier palier",
                "logo": "icones/premierpalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 20,
                "idcible": 1,
                "ratio": 2,
                "typeratio": "vitesse",
                "unlocked": false
            },
            {
                "name": "Nom deuxième palier",
                "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 75,
                "idcible": 1,
                "ratio": 2,
                "typeratio": "vitesse",
                "unlocked": false
            },
            {
                "name": "Nom troisième palier",
                "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 250,
                "idcible": 1,
                "ratio": 2,
                "typeratio": "gain",
                "unlocked": false
            }
            //...
        ]},
    ],
    "allunlocks": [
        {
            "name": "Coronasbirus",
            "logo": "icones/premierunlock.jpg",
            "seuil": 50000,
            "idcible": 0,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        //...
    ],
    "upgrades": [
        {
            "name": "Massacre des sbires mage",
            "logo": "icones/premierupgrade.jpg",
            "seuil": 1e3, //TODO demander pourquoi y'a un e, c'est surement les exposants mais ca a l'air chiant
            "idcible": 1,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        //...
    ],
    "angelupgrades": [
        {
            "name": "Angel Sacrifice",
            "logo": "icones/angel.png",
            "seuil": 10,
            "idcible": 0,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        //...
    ],
    "managers": [
        {
            "name": "Poppy",
            "logo": "icones/poppy.jpg",
            "seuil": 100,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Nasus",
            "logo": "icones/nasus.jpg",
            "seuil": 500,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        }
        //...
    ],
};