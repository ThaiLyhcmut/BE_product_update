const tableCart = document.querySelector("[table-cart]")
console.log(tableCart)
if(tableCart){
  const listQuatity = tableCart.querySelectorAll("input[name='quantity']")
  listQuatity.forEach(itemQuatity => {
    itemQuatity.addEventListener("change", () => {
      const productID = itemQuatity.getAttribute("item-id")
      const quantity = itemQuatity.value
      fetch("/cart/update", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          productID: productID,
          quantity: quantity
        })
      }).then(res => res.json).then(data => {
        if(data.code = "Success"){
          location.reload()
        }
      })
    })
  })
}