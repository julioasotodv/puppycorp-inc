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

#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
import panel as pn
from urllib.request import urlopen, Request
import json
import time
import requests

pn.extension(raw_css=["""body{overflow-x: hidden;}"""])


# In[2]:


def sigmoid(x, cap, midpoint, rate):
    return cap / (1+np.exp(-rate * (x-midpoint)))

def retriever_sales(retriever_price, shepherd_price, chihuahua_price, cat_price, goldfish_price):
    retriever_price = np.maximum(np.array(retriever_price),0)
    shepherd_price = np.maximum(np.array(shepherd_price),0)
    chihuahua_price = np.maximum(np.array(chihuahua_price),0)
    cat_price = np.maximum(np.array(cat_price),0)
    goldfish_price = np.maximum(np.array(goldfish_price),0)
    
    interaction_shepherd = 0.8 + sigmoid(shepherd_price, 0.4, 560, 0.03)
    interaction_chihuahua = 0.9 + sigmoid(chihuahua_price, 0.2, 324, 0.01)
    interaction_cat = 0.83 + sigmoid(cat_price, 0.45, 190, 0.03)
    interacion_goldfish = 1
    res = (sigmoid(retriever_price, 20_000, 450, -0.01) * 
           interaction_shepherd * 
           interaction_chihuahua * 
           interaction_cat *
           interacion_goldfish)
    noise=0
    res += noise
    return np.round(np.maximum(res, 0))

def shepherd_sales(retriever_price, shepherd_price, chihuahua_price, cat_price, goldfish_price):
    retriever_price = np.maximum(np.array(retriever_price),0)
    shepherd_price = np.maximum(np.array(shepherd_price),0)
    chihuahua_price = np.maximum(np.array(chihuahua_price),0)
    cat_price = np.maximum(np.array(cat_price),0)
    goldfish_price = np.maximum(np.array(goldfish_price),0)
    
    interaction_retriever = 0.6 + sigmoid(retriever_price, 0.8, 480, 0.01)
    interaction_chihuahua = 0.85 + sigmoid(chihuahua_price, 0.3, 311, 0.02)
    interaction_cat = 0.9 + sigmoid(cat_price, 0.2, 211, 0.01)
    interacion_goldfish = 1
    res = (sigmoid(shepherd_price, 14_000, 520, -0.007) * 
           interaction_retriever * 
           interaction_chihuahua * 
           interaction_cat *
           interacion_goldfish)
    noise=0
    res += noise
    return np.round(np.maximum(res, 0))

def chihuahua_sales(retriever_price, shepherd_price, chihuahua_price, cat_price, goldfish_price):
    retriever_price = np.maximum(np.array(retriever_price),0)
    shepherd_price = np.maximum(np.array(shepherd_price),0)
    chihuahua_price = np.maximum(np.array(chihuahua_price),0)
    cat_price = np.maximum(np.array(cat_price),0)
    goldfish_price = np.maximum(np.array(goldfish_price),0)
    
    interaction_retriever = 0.9 + sigmoid(retriever_price, 0.2, 420, 0.01)
    interaction_shepherd = 0.85 + sigmoid(shepherd_price, 0.15, 540, 0.005)
    interaction_cat = 0.9 + sigmoid(cat_price, 0.35, 210, 0.02)
    interacion_goldfish = 1
    res = (sigmoid(chihuahua_price, 8600, 324, -0.024) * 
           interaction_retriever * 
           interaction_shepherd * 
           interaction_cat *
           interacion_goldfish)
    noise=0
    res += noise
    return np.round(np.maximum(res, 0))

def cat_sales(retriever_price, shepherd_price, chihuahua_price, cat_price, goldfish_price):
    retriever_price = np.maximum(np.array(retriever_price),0)
    shepherd_price = np.maximum(np.array(shepherd_price),0)
    chihuahua_price = np.maximum(np.array(chihuahua_price),0)
    cat_price = np.maximum(np.array(cat_price),0)
    goldfish_price = np.maximum(np.array(goldfish_price),0)
    
    interaction_retriever = 0.9 + sigmoid(retriever_price, 0.2, 437, 0.05)
    interaction_shepherd = 0.95 + sigmoid(shepherd_price, 0.1, 543, 0.01)
    interaction_chihuahua = 1
    interacion_goldfish = 1
    res = (sigmoid(cat_price, 17000, 237, -0.008) * 
           interaction_retriever * 
           interaction_shepherd * 
           interaction_chihuahua *
           interacion_goldfish)
    noise=0
    res += noise
    return np.round(np.maximum(res, 0))

def goldfish_sales(retriever_price, shepherd_price, chihuahua_price, cat_price, goldfish_price):
    retriever_price = np.maximum(np.array(retriever_price),0)
    shepherd_price = np.maximum(np.array(shepherd_price),0)
    chihuahua_price = np.maximum(np.array(chihuahua_price),0)
    cat_price = np.maximum(np.array(cat_price),0)
    goldfish_price = np.maximum(np.array(goldfish_price),0)
    
    interaction_retriever = 1
    interaction_shepherd = 1
    interaction_chihuahua = 0.95 + sigmoid(chihuahua_price, 0.1, 338, 0.01)
    interaction_cat = 0.8 + sigmoid(cat_price, 0.35, 220, 0.02)
    res = (sigmoid(goldfish_price, 37000, 24, -0.1) * 
           interaction_retriever * 
           interaction_shepherd * 
           interaction_chihuahua *
           interaction_cat)
    noise=0
    res += noise
    return np.round(np.maximum(res, 0))

def cost_structure(sales_array):
    office_costs = 30_000
    
    retriever_costs = 141 * sales_array[...,0]
    retriever_ship = 700_000 * np.minimum(sales_array[...,0], 1)
    
    shepherd_costs = 176 * sales_array[...,1]
    shepherd_ship = 620_000 * np.minimum(sales_array[...,1], 1)
    
    chihuahua_costs = 52 * sales_array[...,2]
    chihuahua_ship = 960_000 * np.minimum(sales_array[...,2], 1)
    
    kitty_costs = 125 * sales_array[...,3]
    kitty_ship = 350_000 * np.minimum(sales_array[...,3], 1)
    
    goldfish_costs = 3 * sales_array[...,4]
    goldfish_ship = 7_000 * np.minimum(sales_array[...,4], 1)
    
    return (office_costs + 
            retriever_costs + retriever_ship +
            shepherd_costs + shepherd_ship +
            chihuahua_costs + chihuahua_ship + 
            kitty_costs + kitty_ship + 
            goldfish_costs + goldfish_ship)


# In[3]:


def get_puppy():
    puppy_url = requests.get("http://dog.ceo/api/breeds/image/random", verify=False, headers={'Origin': "http://dog.ceo"}).json()["message"]

    #user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
    #headers = {'User-Agent': user_agent} 

    #request = Request(puppy_url,data=None,headers=headers)
    #puppy_image = urlopen(request).read()
    return """<img height=250 src="%s"/>""" % puppy_url


# In[4]:


random_puppy = pn.pane.HTML(object="""<img style="margin-left:auto; margin-right:auto; display:block;" id="puppy" height=250 src=""/>""", 
                            sizing_mode="stretch_width")

price_retriever = pn.widgets.FloatInput(name="Price for Golden Retrievers:", start=0.0, end=1000, placeholder="Enter a number")
price_shepherd = pn.widgets.FloatInput(name="Price for German Shepherds:", start=0.0, end=1000, placeholder="Enter a number")
price_chihuahua = pn.widgets.FloatInput(name="Price for Chihuahuas:", start=0.0, end=1000, placeholder="Enter a number")
price_kitten = pn.widgets.FloatInput(name="Price for kittens:", start=0.0, end=1000, placeholder="Enter a number")
price_goldfish = pn.widgets.FloatInput(name="Price for goldfish:", start=0.0, end=1000, placeholder="Enter a number")
button = pn.widgets.Button(name="Get weekly profit!", button_type="primary", sizing_mode="stretch_width")


button_group = pn.WidgetBox(pn.Row(price_retriever, price_shepherd), 
                            pn.Row(price_chihuahua, price_kitten),
                            pn.Row(price_goldfish),
                            pn.Row(button, sizing_mode="stretch_width", margin=(10, 0)),)

answer = pn.pane.Markdown("", align="center")


# In[27]:


dash = pn.Row(pn.layout.HSpacer(),pn.Column(pn.pane.Markdown("# PuppyCORP INC tester!", align="center"), 
                        random_puppy, 
                        button_group, 
                        answer,
                        pn.pane.HTML(object="""<script>
var req = new XMLHttpRequest();
req.responseType = 'json';
req.onreadystatechange = function() {
    if (req.readyState === 4){
        document.getElementById('puppy').src = req.response.message;
        }
    };
    req.open('GET', 'https://dog.ceo/api/breeds/image/random');
    req.send();
</script>""", align="center")), 
             pn.layout.HSpacer()
                        )


# In[28]:


def compute(n_clicks):
    button_group.loading = True
    prices = np.array([price_retriever.value, price_shepherd.value, price_chihuahua.value,
                       price_kitten.value, price_goldfish.value])
    unit_sales = np.array([retriever_sales(*prices),
                           shepherd_sales(*prices),
                           chihuahua_sales(*prices),
                           cat_sales(*prices),
                           goldfish_sales(*prices)])
    revenue = (unit_sales * prices).sum()
    costs = cost_structure(unit_sales)
    profit = revenue - costs
    #new_puppy = get_puppy()
    for i in range(99999999*2):
        a = i
    if answer.disable_math:
        answer.disable_math=False
    else:
        answer.disable_math=True
    #random_puppy.object = new_puppy
    answer.object = f"## You got a weekly profit of \`{profit:,.2f}€\`!"
    button_group.loading = False


# In[29]:


button.on_click(compute)


answer.jscallback(disable_math="""
var req = new XMLHttpRequest();
req.responseType = 'json';
req.onreadystatechange = function() {
    if (req.readyState === 4){
        document.getElementById('puppy').src = req.response.message;
        }
    };
    req.open('GET', 'https://dog.ceo/api/breeds/image/random');
    req.send();
""", args=dict())

# In[30]:


dash.servable()






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