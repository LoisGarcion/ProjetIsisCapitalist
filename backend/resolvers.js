const {writeFile} = require("fs");

function saveWorld(context)  {
    writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error(`Erreur d'écriture du monde coté serveur`)
        }
    })
}

module.exports = {
    Query: {
        getWorld(parent, args, context) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            let product = context.world.products.find(p => p.id === args.id)
            if(!product){
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            }
            if (product) {
                product.quantite += args.quantite
                context.world.money -= product.cout * (1 - Math.pow(product.croissance, args.quantite)) / (1 - product.croissance)
                saveWorld(context)
                return product
            }
        }
    }
};
