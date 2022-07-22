import React, { useState } from 'react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Dropzone from 'react-dropzone'
import { ConversationScroller } from 'linkedin-private-api/dist/src/scrollers';
import { forEach } from 'lodash';


const CreateProduct = (props) => {

    const [productVariantPrices, setProductVariantPrices] = useState([])
    const [title, setTitle] = useState('')
    const [imgurl, setImgurl] = useState('')
    const [desctiption, setDesctiption] = useState('')
    const [psku, setPsku] = useState('')
    const [productVariants, setProductVariant] = useState([
        {
            option: 1,
            tags: []
        }
    ])
    const [image, setImage] = useState(null);
    const onImageChange = (file) => {
        if (file) {
        setImage(URL.createObjectURL(file));
        }
    };
    
    console.log(typeof props.variants)

   // handle click event of the Add button
    const handleAddClick = () => {
        console.log(props.variants)
        let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(el => el.id)
        console.log(all_variants)
        let selected_variants = productVariants.map(el => el.option);
        console.log(selected_variants)
        let available_variants = all_variants.filter(entry1 => !selected_variants.some(entry2 => entry1 == entry2))
        setProductVariant([...productVariants, {
            option: available_variants[0],
            tags: []
        }])
    };

    // handle input change on tag input
    const handleInputTagOnChange = (value, index) => {
        let product_variants = [...productVariants]
        product_variants[index].tags = value
        setProductVariant(product_variants)

        checkVariant()
    }

    // remove product variant
    const removeProductVariant = (index) => {
        let product_variants = [...productVariants]
        product_variants.splice(index, 1)
        setProductVariant(product_variants)
    }

    // check the variant and render all the combination
    const checkVariant = () => {
        let tags = [];

        productVariants.filter((item) => {
            tags.push(item.tags)
        })

        setProductVariantPrices([])

        getCombn(tags).forEach(item => {
            setProductVariantPrices(productVariantPrice => [...productVariantPrice, {
                title: item,
                price: 0,
                stock: 0
            }])
        })

    }

    // combination algorithm
    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce(function (ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + value + '/'));
        }, []);
        return ans;
    }






    // getting cookies 
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const Imgbb = async (image) => {
        let img 
        const formData = new FormData();
        formData.append("image", image);
        const url =
          "https://api.imgbb.com/1/upload?key=9f7c4ce4a7f88b88c165406bf575051a";
      
        await fetch(url, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              img = res.data.url;
            }
          });
        return img
      };




    // Save product
    let saveProduct = async (event) => {
        event.preventDefault();
        console.log(productVariants)
        console.log(productVariantPrices)
        console.log(title)
        console.log(desctiption)
        console.log(psku)
        let url = await imgurl
        const data = {
            variant: productVariants,
            product_variant_price: productVariantPrices,
            title: title,
            desctiption: desctiption,
            sku: psku,
            image: url
        }
        // TODO : write your code here to save the product
        var csrftoken = getCookie('csrftoken');
        console.log(csrftoken)
        console.log(data)
        let response = fetch("http://127.0.0.1:8000/product/create/", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
        }).then(res=>res.json())
        .then(res=> console.log(res))


    }


    return (
        <div>
            <section>
                <form onSubmit={saveProduct}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="">Product Name</label>
                                    <input onChange={() => setTitle(event.target.value)} type="text" placeholder="Product Name" className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Product SKU</label>
                                    <input onChange={() => setPsku(event.target.value)} type="text" placeholder="Product Name" className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Description</label>
                                    <textarea onChange={() => setDesctiption(event.target.value)} id="" cols="30" rows="4" className="form-control"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Media</h6>
                            </div>
                            <img src={image} />
                            <div className="card-body border">
                                
                                <Dropzone onDrop={acceptedFiles => {
                                    onImageChange(acceptedFiles[0])
                                    setImgurl(Imgbb(acceptedFiles[0]))
                                }}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Variants</h6>
                            </div>
                            <div className="card-body">

                                {
                                    productVariants.map((element, index) => {
                                        return (
                                            <div className="row" key={index}>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="">Option</label>
                                                        <select className="form-control" defaultValue={element.option}>
                                                            {
                                                                JSON.parse(props.variants.replaceAll("'", '"')).map((variant, index) => {
                                                                    return (<option key={index}
                                                                        value={variant.id}>{variant.title}</option>)
                                                                })
                                                            }

                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        {
                                                            productVariants.length > 1
                                                                ? <label htmlFor="" className="float-right text-primary"
                                                                    style={{ marginTop: "-30px" }}
                                                                    onClick={() => removeProductVariant(index)}>remove</label>
                                                                : ''
                                                        }

                                                        <section style={{ marginTop: "30px" }}>
                                                            <TagsInput value={element.tags}
                                                                style="margin-top:30px"
                                                                onChange={(value) => handleInputTagOnChange(value, index)} />
                                                        </section>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                            <div className="card-footer">
                                {productVariants.length !== 3
                                    ? <button className="btn btn-primary" onClick={handleAddClick}>Add another
                                        option</button>
                                    : ''
                                }

                            </div>

                            <div className="card-header text-uppercase">Preview</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <td>Variant</td>
                                                <td>Price</td>
                                                <td>Stock</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productVariantPrices.map((productVariantPrice, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{productVariantPrice.title}</td>
                                                            <td><input onChange={() => {
                                                                productVariantPrice.price = parseFloat(event.target.value)
                                                            }} className="form-control" type="text" /></td>
                                                            <td><input onChange={() => {
                                                                productVariantPrice.stock = parseInt(event.target.value)
                                                            }} className="form-control" type="text" /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-lg btn-primary">Save</button>
                <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
                </form>
            </section>
        </div>
    );
};

export default CreateProduct;




