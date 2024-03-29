module.exports = {
    "name": "Zaun Capitalist",
    "logo": "icones/logomonde.png",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": "0",
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
            "paliers": [
                {
                    "name": "Execution de sbires mage",
                    "logo": "icones/premierpalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Anhilation de sbires mage",
                    "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Génocide de sbires mage",
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
        "logo": "icones/sbirecanon.png",
        "cout": 50,
        "croissance": 1.07,
        "revenu": 20,
        "vitesse": 2000,
        "quantite": 0,
        "timeleft": 0,
        "managerUnlocked": false,
        "paliers": [
            {
                "name": "Execution de sbires cannon",
                "logo": "icones/premierpalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 20,
                "idcible": 2,
                "ratio": 2,
                "typeratio": "vitesse",
                "unlocked": false
            },
            {
                "name": "Anhilation de sbires cannon",
                "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 75,
                "idcible": 2,
                "ratio": 2,
                "typeratio": "vitesse",
                "unlocked": false
            },
            {
                "name": "Génocide de sbires cannon",
                "logo": "icones/deuxiemepalier.jpg", //Mettre l'icone du produit, ou un icone marrant style hydre vorace
                "seuil": 250,
                "idcible": 2,
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
            "seuil": 10,
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
            "logo": "icones/sbiremage.jpg",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Tueur de cannons",
            "logo": "icones/sbirecannon.jpg",
            "seuil": 1e3,
            "idcible": 2,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        //...
    ],
    "angelupgrades": [
        {
            "name": "Porofessor",
            "logo": "icones/porofessor.png",
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
            "logo": "icones/poppy.png",
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
            "idcible": 2,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        }
        //...
    ],
};