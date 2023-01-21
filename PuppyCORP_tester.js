importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");

function sendPatch(patch, buffers, msg_id) {
  self.postMessage({
    type: 'patch',
    patch: patch,
    buffers: buffers
  })
}

async function startApplication() {
  console.log("Loading pyodide!");
  self.postMessage({type: 'status', msg: 'Loading...'})
  self.pyodide = await loadPyodide();
  self.pyodide.globals.set("sendPatch", sendPatch);
  console.log("Loaded!");
  await self.pyodide.loadPackage("micropip");
  const env_spec = ['https://cdn.holoviz.org/panel/0.14.2/dist/wheels/bokeh-2.4.3-py3-none-any.whl', 'https://cdn.holoviz.org/panel/0.14.2/dist/wheels/panel-0.14.2-py3-none-any.whl', 'pyodide-http==0.1.0', 'numpy', 'pandas', 'requests']
  for (const pkg of env_spec) {
    let pkg_name;
    if (pkg.endsWith('.whl')) {
      pkg_name = pkg.split('/').slice(-1)[0].split('-')[0]
    } else {
      pkg_name = pkg
    }
    self.postMessage({type: 'status', msg: `Loading...`})
    try {
      await self.pyodide.runPythonAsync(`
        import micropip
        await micropip.install('${pkg}');
      `);
    } catch(e) {
      console.log(e)
      self.postMessage({
	type: 'status',
	msg: `Error while installing ${pkg_name}`
      });
    }
  }
  console.log("Packages loaded!");
  self.postMessage({type: 'status', msg: 'Loading...'})
  const code = `
  
import asyncio

from panel.io.pyodide import init_doc, write_doc

init_doc()

U='amazing_score'
T='great_score'
S='stretch_width'
K='center'
J='newpuppy'
H='Enter a number'
F=0.0
D=False
import numpy as A,pandas as f,panel as B
from urllib.request import urlopen,Request
import json,time,requests as V
B.extension(raw_css=['body{overflow-x: hidden;}'],js_files={'conf':'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'})
def C(x,cap,midpoint,rate):return cap/(1+A.exp(-rate*(x-midpoint)))
def W(retriever_price,shepherd_price,chihuahua_price,cat_price,goldfish_price):G=goldfish_price;F=cat_price;E=chihuahua_price;D=shepherd_price;B=retriever_price;B=A.maximum(A.array(B),0);D=A.maximum(A.array(D),0);E=A.maximum(A.array(E),0);F=A.maximum(A.array(F),0);G=A.maximum(A.array(G),0);I=0.8+C(D,0.4,560,0.03);J=0.9+C(E,0.2,324,0.01);K=0.83+C(F,0.45,190,0.03);L=1;H=C(B,20000,450,-0.01)*I*J*K*L;M=0;H+=M;return A.round(A.maximum(H,0))
def X(retriever_price,shepherd_price,chihuahua_price,cat_price,goldfish_price):G=goldfish_price;F=cat_price;E=chihuahua_price;D=shepherd_price;B=retriever_price;B=A.maximum(A.array(B),0);D=A.maximum(A.array(D),0);E=A.maximum(A.array(E),0);F=A.maximum(A.array(F),0);G=A.maximum(A.array(G),0);I=0.6+C(B,0.8,480,0.01);J=0.85+C(E,0.3,311,0.02);K=0.9+C(F,0.2,211,0.01);L=1;H=C(D,14000,520,-0.007)*I*J*K*L;M=0;H+=M;return A.round(A.maximum(H,0))
def Y(retriever_price,shepherd_price,chihuahua_price,cat_price,goldfish_price):G=goldfish_price;F=cat_price;E=chihuahua_price;D=shepherd_price;B=retriever_price;B=A.maximum(A.array(B),0);D=A.maximum(A.array(D),0);E=A.maximum(A.array(E),0);F=A.maximum(A.array(F),0);G=A.maximum(A.array(G),0);I=0.9+C(B,0.2,420,0.01);J=0.85+C(D,0.15,540,0.005);K=0.9+C(F,0.35,210,0.02);L=1;H=C(E,8600,324,-0.024)*I*J*K*L;M=0;H+=M;return A.round(A.maximum(H,0))
def Z(retriever_price,shepherd_price,chihuahua_price,cat_price,goldfish_price):G=goldfish_price;F=chihuahua_price;E=cat_price;D=shepherd_price;B=retriever_price;B=A.maximum(A.array(B),0);D=A.maximum(A.array(D),0);F=A.maximum(A.array(F),0);E=A.maximum(A.array(E),0);G=A.maximum(A.array(G),0);I=0.9+C(B,0.2,437,0.05);J=0.95+C(D,0.1,543,0.01);K=1;L=1;H=C(E,17000,237,-0.008)*I*J*K*L;M=0;H+=M;return A.round(A.maximum(H,0))
def a(retriever_price,shepherd_price,chihuahua_price,cat_price,goldfish_price):G=shepherd_price;F=retriever_price;E=goldfish_price;D=cat_price;B=chihuahua_price;F=A.maximum(A.array(F),0);G=A.maximum(A.array(G),0);B=A.maximum(A.array(B),0);D=A.maximum(A.array(D),0);E=A.maximum(A.array(E),0);I=1;J=1;K=0.95+C(B,0.1,338,0.01);L=0.8+C(D,0.35,220,0.02);H=C(E,37000,24,-0.1)*I*J*K*L;M=0;H+=M;return A.round(A.maximum(H,0))
def b(sales_array):B=sales_array;C=30000;D=141*B[(...,0)];E=700000*A.minimum(B[(...,0)],1);F=176*B[(...,1)];G=620000*A.minimum(B[(...,1)],1);H=52*B[(...,2)];I=960000*A.minimum(B[(...,2)],1);J=125*B[(...,3)];K=350000*A.minimum(B[(...,3)],1);L=3*B[(...,4)];M=7000*A.minimum(B[(...,4)],1);return C+D+E+F+G+H+I+J+K+L+M
def g():A=V.get('http://dog.ceo/api/breeds/image/random',verify=D,headers={'Origin':'http://dog.ceo'}).json()['message'];return'<img height=250 src="%s"/>'%A
c=B.pane.HTML(object='<img style="margin-left:auto; margin-right:auto; display:block;" id="puppy" height=250 src=""/>',sizing_mode=S)
L=B.widgets.FloatInput(name='Price for Golden Retrievers:',start=F,end=1000,placeholder=H)
M=B.widgets.FloatInput(name='Price for German Shepherds:',start=F,end=1000,placeholder=H)
N=B.widgets.FloatInput(name='Price for Chihuahuas:',start=F,end=1000,placeholder=H)
O=B.widgets.FloatInput(name='Price for kittens:',start=F,end=1000,placeholder=H)
P=B.widgets.FloatInput(name='Price for goldfish:',start=F,end=1000,placeholder=H)
Q=B.widgets.Button(name='Get weekly profit!',button_type='primary',sizing_mode=S)
G=B.pane.JSON(object={J:D,T:D,U:D},visible=D)
h=B.widgets.Spinner(value=0,width=75)
I=B.WidgetBox(B.Row(L,M),B.Row(N,O),B.Row(P),B.Row(Q,sizing_mode=S,margin=(10,0)))
R=B.pane.Markdown('',align=K)
E=B.pane.HTML(object='',align=K)
d=B.Row(B.layout.HSpacer(),B.Column(B.pane.HTML('<h1 style="margin-bottom: 0">PuppyCORP INC tester!</h1>',align=K),c,I,R,E,G,B.pane.HTML(object="<script>\\nvar req = new XMLHttpRequest();\\nreq.responseType = 'json';\\nreq.onreadystatechange = function() {\\n    if (req.readyState === 4){\\n        document.getElementById('puppy').src = req.response.message;\\n        }\\n    };\\n    req.open('GET', 'https://dog.ceo/api/breeds/image/random');\\n    req.send();\\n</script>",align=K)),B.layout.HSpacer())
def e(n_clicks):
	H=True;I.loading=H;F=A.array([L.value,M.value,N.value,O.value,P.value]);K=A.array([W(*F),X(*F),Y(*F),Z(*F),a(*F)]);Q=(K*F).sum();S=b(K);C=Q-S
	for V in range(99999999*2):c=V
	B={**G.object}
	if C>6950000:B[U]=H
	else:B[U]=D
	if C>6750000:B[T]=H
	else:B[T]=D
	if B[J]:B[J]=D;G.object=B
	else:B[J]=H;G.object=B
	R.object=f"## You got a weekly profit of \`{C:,.2f}€\`!"
	if C<=0:E.object='<p style="margin-top:0">Try again &#128579;</p>'
	elif C<=6081020:E.object='<p style="margin-top:0; font-size: 1.25em">Keep on trying! &#128054;</p>'
	elif C<=6500000:E.object='<p style="margin-top:0; font-size: 1.5em">Not bad! &#128522;</p>'
	elif C<=6750000:E.object="""<p style="margin-top:0; font-size: 1.75em">That's pretty good! &#128515;</p>"""
	elif C<=6950000:E.object='<p style="margin-top:0; font-size: 1.75em">Great job! &#128526;</p>'
	else:E.object="""<p style="margin-top:0; font-size: 2em">Amazing result! It doesn't get much better than this &#129321;</p>"""
	I.loading=D
Q.on_click(e)
G.jscallback(object="\\nvar req = new XMLHttpRequest();\\nreq.responseType = 'json';\\nreq.onreadystatechange = function() {\\n    if (req.readyState === 4){\\n        document.getElementById('puppy').src = req.response.message;\\n        }\\n    };\\nreq.open('GET', 'https://dog.ceo/api/breeds/image/random');\\nreq.send();\\nvar frontend_metadata = JSON.parse(cb_obj.text);\\nif (frontend_metadata.amazing_score){\\n    var end = Date.now() + (5 * 1000);\\n\\n    var colors = ['#bb0000', '#4ba0ee'];\\n\\n    (function frame() {\\n      confetti({\\n        particleCount: 2,\\n        angle: 60,\\n        spread: 55,\\n        origin: { x: 0 },\\n        colors: colors\\n      });\\n      confetti({\\n        particleCount: 2,\\n        angle: 120,\\n        spread: 55,\\n        origin: { x: 1 },\\n        colors: colors\\n      });\\n\\n      if (Date.now() < end) {\\n        requestAnimationFrame(frame);\\n      }\\n    }());\\n}\\nelse if (frontend_metadata.great_score){\\n    confetti({particleCount: 100,\\n              spread: 70,\\n              origin: { y: 0.8 }\\n             });\\n};\\n",args=dict())
d.servable()

await write_doc()
  `

  try {
    const [docs_json, render_items, root_ids] = await self.pyodide.runPythonAsync(code)
    self.postMessage({
      type: 'render',
      docs_json: docs_json,
      render_items: render_items,
      root_ids: root_ids
    })
  } catch(e) {
    const traceback = `${e}`
    const tblines = traceback.split('\n')
    self.postMessage({
      type: 'status',
      msg: tblines[tblines.length-2]
    });
    throw e
  }
}

self.onmessage = async (event) => {
  const msg = event.data
  if (msg.type === 'rendered') {
    self.pyodide.runPythonAsync(`
    from panel.io.state import state
    from panel.io.pyodide import _link_docs_worker

    _link_docs_worker(state.curdoc, sendPatch, setter='js')
    `)
  } else if (msg.type === 'patch') {
    self.pyodide.runPythonAsync(`
    import json

    state.curdoc.apply_json_patch(json.loads('${msg.patch}'), setter='js')
    `)
    self.postMessage({type: 'idle'})
  } else if (msg.type === 'location') {
    self.pyodide.runPythonAsync(`
    import json
    from panel.io.state import state
    from panel.util import edit_readonly
    if state.location:
        loc_data = json.loads("""${msg.location}""")
        with edit_readonly(state.location):
            state.location.param.update({
                k: v for k, v in loc_data.items() if k in state.location.param
            })
    `)
  }
}

startApplication()