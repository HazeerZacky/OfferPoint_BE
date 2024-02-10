import React,{useState, useEffect} from "react";
import categoryService from '../service';

export const CategorySelector = (props)=>{
    const [items, setItems] = useState([]);

    useEffect(()=>{
        fetchCategory();
    },[]);

    const fetchCategory = ()=>{
        categoryService.getAllCategoryAsKeyValue().then((data)=>{
            setItems([{k: 0, v:'--select category--'}, ...data]);
        })
    }

    return (
        <select id="categories" className={`form-control ${props.className}`} value={props.CategoryID} onChange={props.onChange}>
            {items.map((v, i)=> <option value={v.k} key={i}>{v.v}</option>)}
        </select>
    );
}