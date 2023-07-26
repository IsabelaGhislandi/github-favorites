import { GithubUser } from "./GithubUser.js"


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    
    }

    load() {
        //nome da m9inha key, tem q sair de string pra json q vira objeto
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
      
    }

    delete(user) {
        //filter está retornando um novo array. Se é diferente do que tem na array
        const filtered = this.entries.filter( entry => entry.login !== user.login )
        this.entries = filtered
        this.update()
        this.save()
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    //função promessa
    async add(username) {
        try {


            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuarário já cadastrado')
            }

            const user = await GithubUser.search(username)
            console.log(user)

            if (user.login == undefined) {
                throw new Error('Usuário não encontrado')
            }

            //adicionando usuario, criando um novo array e trazendo de volta todos os elementos do antigo this.entries
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            
            alert(error.message)
        }
       
    }
}


export class FavoritesView extends Favorites {
    constructor(root){
        super(root)
       
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addbutton = this.root.querySelector('#btn-send')
        console.log(addbutton)
        addbutton.onclick  = () => {
            
            const { value } = this.root.querySelector('.input input')
            this.add(value)
        } 

    }

    update() {
       this.removeAllTr()
        this.entries.forEach( user => {
           const row = this.createRow()
           
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
           
           console.log(row.querySelector('.remove'))

           row.querySelector('.remove').addEventListener("click", () => {
             
                if (confirm('Tem certeza que deseja deletar essa linha?')) {
                    this.delete(user)
                }
           })
            
     

            this.tbody.append(row)
        })
     
    }

    createRow(){
        const tr = document.createElement('tr')
       
        tr.innerHTML = `
            <td class="user">
            <img src="" alt="">
            <a href=""  target="_blank">
                <p></p>
                <span>/</span>
            </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td class="remove">Remover</td>
        `
        return tr
    }

    removeAllTr() {
       this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        });
    }
}