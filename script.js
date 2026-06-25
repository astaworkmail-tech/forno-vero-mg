addEventListener("scroll",()=>{const n=document.getElementById("mg-nav");if(scrollY>innerHeight*.7){n.style.opacity=1;n.style.transform="none"}else{n.style.opacity=0;n.style.transform="translateY(-100%)"}},{passive:true});

(function(){
    var s=document.currentScript,sec=s&&s.closest("section"),h=sec&&sec.querySelector(".mg-reveal");
    if(!h)return;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    var lines=h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML=lines.map(function(l,i){return '<span class="mg-rl" style="--mg-i:'+i+'"><span>'+l+'</span></span>';}).join("");
  })();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rise").forEach((el,i)=>{el.style.transitionDelay=Math.min(i%4*70,210)+"ms";io.observe(el)});

var cart={};
function fmt(n){return '$'+n.toFixed(2);}
function renderCart(){
  var items=document.getElementById('cart-items'),ids=Object.keys(cart),count=0,total=0,html='';
  if(!ids.length){items.innerHTML='<p class="mono" style="color:var(--stone);text-align:center;padding:1rem 0">Empty — add a pie</p>';}
  else{ids.forEach(function(id){var it=cart[id];count+=it.q;total+=it.q*it.price;html+='<div class="cline"><span class="q" data-sub="'+id+'">−</span><span class="q" data-add2="'+id+'">+</span><span class="nm">'+it.name+'</span><span class="am">×'+it.q+' · '+fmt(it.q*it.price)+'</span></div>';});items.innerHTML=html;}
  document.getElementById('grand').textContent=fmt(total);
  document.getElementById('tabcount').textContent=count;
  var pay=document.getElementById('pay');pay.disabled=count===0;
  window._total=total;
  if(count>0){document.getElementById('cartwrap').classList.add('show');document.getElementById('carttab').classList.add('hide');}
}
document.addEventListener('click',function(e){
  var a=e.target.closest('.add');
  if(a){var id=a.dataset.id;if(!cart[id])cart[id]={name:a.dataset.name,price:parseFloat(a.dataset.price),q:0};cart[id].q++;renderCart();return;}
  if(e.target.dataset.sub){var s=e.target.dataset.sub;if(cart[s]){cart[s].q--;if(cart[s].q<=0)delete cart[s];renderCart();}}
  if(e.target.dataset.add2){var d=e.target.dataset.add2;if(cart[d]){cart[d].q++;renderCart();}}
});
document.getElementById('carttab').addEventListener('click',function(){document.getElementById('cartwrap').classList.add('show');this.classList.add('hide');});
document.getElementById('closecart').addEventListener('click',function(){document.getElementById('cartwrap').classList.remove('show');document.getElementById('carttab').classList.remove('hide');});
document.getElementById('pay').addEventListener('click',function(){
  var total=window._total||0,email=document.getElementById('email').value.trim(),name=document.getElementById('name').value.trim();
  if(total<=0)return;
  if(!email||email.indexOf('@')<0){document.getElementById('email').focus();return;}
  var lines=Object.keys(cart).map(function(id){return cart[id].q+'× '+cart[id].name;}).join(', ');
  if(typeof window.__processDonation==='function'){window.__processDonation({amount:total,email:email,name:name,label:'Forno Vero — '+lines});}
});