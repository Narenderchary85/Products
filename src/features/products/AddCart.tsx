import React from 'react'

const AddCart = ({name,description,price}) => {
  return (
    <div>
      <h1>Add to Cart prodducts</h1>
      <div>{name}</div>
      <div>{description}</div>
      <div>{price}</div>
    </div>
  )
}

export default AddCart
