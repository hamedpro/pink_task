import React, { Fragment, useContext, useState } from "react";
import { useEffect } from "react";
import { get_collection } from "../../api/client";

import ObjectBox from "./ObjectBox";

export const Events = () => {
	var { global_data, get_global_data } = useContext(GlobalDataContext);
	var user_id = localStorage.getItem("user_id");
	var [events, set_events] = useState(null);
	async function get_data() {
		set_events(global_data.user.events);
	}
	useEffect(() => {
		get_data();
	}, []);
	if (events === null) return <h1>still loading user event...</h1>;
	return (
		<>
			<h1>Event</h1>
			{events.map((event, index) => {
				return (
					<Fragment key={index}>
						<ObjectBox object={event} />
						<hr />
					</Fragment>
				);
			})}
		</>
	);
};
