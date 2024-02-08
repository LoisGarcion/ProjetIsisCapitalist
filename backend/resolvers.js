const {writeFile} = require("fs");

function saveWorld(context)  {
    writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error(`Erreur d'écriture du monde coté serveur`)
        }
    })
}

function updateMoney(context) {
    let total = 0
    let w = context.world
    context.world.products.forEach(p => {
        let time = Date.now() - Number(w.lastupdate)
        if(!p.managerUnlocked){
            if(p.timeleft < 0){
                total += p.quantite * p.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)
            }
            else if(p.timeleft > 0){
                p.timeleft -= time
            }
        }
        else{
            if(p.timeleft < 0){
                total += (1 + (-p.timeleft/p.vitesse) * (p.quantite * p.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)))
                p.timeleft = (-p.timeleft%p.vitesse)
            }
            else if(p.timeleft === 0){
                total += p.quantite * p.revenu * (1 + context.world.activeangels * context.world.angelbonus / 100)
                p.timeleft = p.vitesse
            }
            else{
                p.timeleft -= time
            }
        }
    })
    w.lastupdate = Date.now().toString()
    context.world.money += total
    //TODO je sais pas pour le score si c'est ca
    context.world.score += total
    saveWorld(context)
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
                let couttotal = this.prix * (1 - Math.pow(this.croissance, args.quantite) / (- this.croissance))
                product.qt += args.quantite;
                product.prix = this.prix * Math.pow(this.croissance, args.quantite)
                context.world.money -= couttotal
                context.world.score += 2
                saveWorld(context)
            }
            return product
        },
        lancerProductionProduit(parent, args, context) {
            updateMoney(context)
            let product = context.world.products.find(p => p.id === args.id)
            if(!product){
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            }
            if (product) {
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
                manager.unlocked = true
                product.managerUnlocked = true
                saveWorld(context)
            }
        },
    }
};