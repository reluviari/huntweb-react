import React, { Component } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

import "./style.css";

export default class Main extends Component {
	state = {
		products: [],
		productInfo: {},
		page: 1,
		errorApi: null,
	};

	componentDidMount() {
		this.loadProducts();
	}

	loadProducts = async (page = 1) => {
		try {
			const response = await api.get(`/products?page=${page}`);
			const { docs, ...productInfo } = response.data;
			this.setState({ products: docs, productInfo, page });
		} catch (err) {
			this.setState({ errorApi: true });
		}
	};

	renderError() {
		return (
			<div className='errorApi'>
				<strong>
					Não foi possível carregar os dados. Tente novamente mais
					tarde!
				</strong>
			</div>
		);
	}

	renderProducts = () => {
		const { products, page, productInfo } = this.state;
		return (
			<div className='product-list'>
				{products.map(product => (
					<article key={product._id}>
						<strong>{product.title}</strong>
						<p>{product.description}</p>
						<Link to={`/products/${product._id}`}>Acessar</Link>
					</article>
				))}
				<div className='actions'>
					<button disabled={page === 1} onClick={this.prevPage}>
						Anterior
					</button>
					<button
						disabled={page === productInfo.pages}
						onClick={this.nextPage}>
						Próximo
					</button>
				</div>
			</div>
		);
	};

	prevPage = () => {
		const { page } = this.state;
		if (page === 1) return;
		const pageNumber = page - 1;
		this.loadProducts(pageNumber);
	};

	nextPage = () => {
		const { page, productInfo } = this.state;
		if (page === productInfo.pages) return;
		const pageNumber = page + 1;
		this.loadProducts(pageNumber);
	};

	render() {
		const { errorApi } = this.state;

		return (
			<div>{errorApi ? this.renderError() : this.renderProducts()}</div>
		);
	}
}
