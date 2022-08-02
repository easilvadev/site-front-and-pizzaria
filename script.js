let cart = [];
let modalqt = 1;
let modalkey = 0;

const c = (ele)=> document.querySelector(ele);
const cs =(el)=>document.querySelectorAll(el);

//listagem das pizza
pizzaJson.map(function(item, index){
    let pizzaitem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaitem.setAttribute( 'data-key', index);
    pizzaitem.querySelector('.pizza-item--img img').src = item.img;
    pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}` ;
    pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaitem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalqt = 1;
        modalkey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML= pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}` ;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size,sizeindex)=>{

            if(sizeindex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex] ;

        });
        c('.pizzaInfo--qt').innerHTML = modalqt;
        

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200)

    });
   
    document.querySelector('.pizza-area').append( pizzaitem );

    


});

// eventos do modal
function closemodal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500);

};
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click',closemodal);
})
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalqt > 1){
        modalqt--;
        c('.pizzaInfo--qt').innerHTML = modalqt;
    };
});

c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalqt++;
    c('.pizzaInfo--qt').innerHTML = modalqt;

});
cs('.pizzaInfo--size').forEach((size,sizeindex)=>{

    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

    })

});
c('.pizzaInfo--addButton').addEventListener('click',()=>{

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalkey].id+'@'+size

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    })
    if(key > -1){
        cart[key].qt +=modalqt;
    }else{

    cart.push({
        identifier,
        id:pizzaJson[modalkey].id,
        size,
        qt:modalqt
    });}
    updatecart();
    closemodal();

});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
})

function updatecart(){

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0){

        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart){

            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;

                let cartItem = c('.models .cart--item').cloneNode(true);
                let pizzaSizename;

                switch(cart[i].size){
                    case 0:
                        pizzaSizename ='P';
                    break;
                    case 1:
                        pizzaSizename ='M';
                    break;

                    case 0:
                        pizzaSizename ='G';
                    break;
                };


                let pizzaname = `${pizzaItem.name} (${pizzaSizename})`;

                

                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaname;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                    if(cart[i].qt < 1){
                        cart[i].qt--;
                    }else{
                        cart.splice(i,1);
                    }
                    updatecart();
                })
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                    cart[i].qt++;
                    updatecart();
                    
                })
                c('.cart').append(cartItem);
            
            desconto  = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `${total.toFixed(2)}`;

                
            

        }

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};

