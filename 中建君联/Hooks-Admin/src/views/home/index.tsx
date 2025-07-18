import { getAuthorButtons } from "@/api/modules/login";
import welcome from "@/assets/images/welcome01.png";
import "./index.less";
import { useEffect } from "react";

const Home = () => {
	// 获取按钮权限列表
	const getAuthButtonsList = async () => {
		const { data } = await getAuthorButtons();
		console.log("data-getAuthButtonsList: ", data);
		// setAuthButtons(data);
	};
	useEffect(() => {
		getAuthButtonsList();
	}, []);
	return (
		<div className="home card">
			<img src={welcome} alt="welcome" />
		</div>
	);
};

export default Home;
