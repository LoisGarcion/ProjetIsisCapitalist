const {writeFile} = require("fs");

function saveWorld(context)  {
    writeFile("../userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error(`Erreur d'écriture du monde coté serveur`)
        }
    })
}

function calcQtProductionforElapseTime(product, elapseTime) { //RECALER LE TEMPS DES LE DEPART A 0
    let remainingTime = product.timeleft - elapseTime
    if(!product.managerUnlocked){
        if(product.timeleft !== 0 && remainingTime <= 0){
            product.timeleft = 0
            return 1
        }
        else if(product.timeleft!==0 && remainingTime > 0){
            product.timeleft -= elapseTime
            return 0
        }
        else{
            return 0
        }
    }
    else{
        if(product.timeleft === 0){
            return 0
        }
        if(remainingTime < 0){
            product.timeleft = (product.vitesse - (-remainingTime%product.vitesse))
            return (1 + (Math.floor(-remainingTime/product.vitesse)))
        }
        else if(remainingTime === 0){
            product.timeleft = product.vitesse
            return 1
        }
        else{
            product.timeleft -= elapseTime
            return 0
        }
    }
}

function updateMoney(context) {
    let total = 0
    let w = context.world
    context.world.products.forEach(p => {
        let time = Date.now() - Number(w.lastupdate)
        let qtProduit = calcQtProductionforElapseTime(p, time)
        total += qtProduit * p.quantite * p.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)
    })
    w.lastupdate = Date.now().toString()
    context.world.money += total
    context.world.score += total
}

function unlockEffect(palier, product) {
    if(palier.typeratio === "vitesse"){
        product.vitesse /= palier.ratio
        product.timeleft /= palier.ratio
    }
    else if(palier.typeratio === "gain"){
        product.revenu *= palier.ratio
    }
}

module.exports = {
    Query: {
        getWorld(parent, args, context) {
            updateMoney(context)
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            updateMoney(context)
            let product = context.world.products.find(p => p.id === args.id)
            if(!product){
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            }
            if (product) {
                let couttotal = product.cout * (1 - Math.pow(product.croissance, args.quantite)) / (1 - product.croissance)
                if(context.world.money < couttotal){
                    throw new Error(`Vous n'avez pas assez d'argent pour acheter ${args.quantite} ${product.name}`)
                }
                product.quantite += args.quantite;
                product.cout = product.cout * Math.pow(product.croissance, args.quantite);
                context.world.money -= couttotal;

                //Unlock un produit
                if(product.paliers.length > 0){
                    let palier;
                    for(palier of product.paliers.filter(p => p.unlocked === false && p.seuil <= product.quantite)){
                        unlockEffect(palier, product);
                    }
                }

                //Unlock tous les produits
                if(context.world.allunlocks.length > 0){
                    let palier;
                    let unlockPalier = true;
                    for(palier of context.world.allunlocks.filter(p => p.unlocked === false && p.seuil <= product.quantite)) {
                        for(let p of context.world.products){
                            if(palier.seuil > p.quantite){
                                unlockPalier = false;
                                break;
                            }
                        }
                        if(unlockPalier){
                            for(let prod of context.world.products){
                                unlockEffect(palier, prod);
                            }
                        }
                    }
                }
                saveWorld(context);
            }
            return product
        },
        lancerProductionProduit(parent, args, context) {
            updateMoney(context)
            let product = context.world.products.find(p => p.id === args.id)
            if(!product){
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            }
            if (product && product.timeleft === 0) {
                product.timeleft = product.vitesse
                product.lastupdate = Date.now()
                saveWorld(context)
            }
        },
        engagerManager(parent, args, context) {
            updateMoney(context)
            let manager = context.world.managers.find(p => p.name === args.name)
            let product = context.world.products.find(p => p.id === manager.idcible)
            if(!manager){
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            }
            if (manager) {
                if(context.world.money < manager.cout){
                    throw new Error(`Vous n'avez pas assez d'argent pour engager ${args.name}`)
                }
                manager.unlocked = true
                product.managerUnlocked = true
                console.log("J'ai : " + context.world.money +" gold");
                context.world.money -= manager.seuil
                console.log("Il me reste : " + context.world.money +" gold");
                if(product.timeleft === 0){
                    product.timeleft = product.vitesse;
                    product.lastupdate = Date.now()
                }
                saveWorld(context)
            }
        },
    }
};