import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_users, new_pack } from "../../api/client";
import Select from "react-select";
import { GlobalDataContext } from "../GlobalDataContext";
export const NewPack = () => {
	var [all_users, set_all_users] = useState(null);
	var [selected_collaborators, set_selected_collaborators] = useState([]);
	var [selected_parent_pack, set_selected_parent_pack] = useState({
		label: "without a parent",
		value: null,
	});
	var { global_data, get_global_data } = useContext(GlobalDataContext);
	var user_id = localStorage.getItem("user_id");
	var nav = useNavigate();
	async function submit_new_pack() {
		var title = document.getElementById("title").value;
		var description = document.getElementById("description").value;
		var collaborators = selected_collaborators.map((i) => {
			return { access_level: 1, user_id: i.value };
		});
		collaborators.push({ access_level: 3, user_id });
		try {
			var id_of_new_pack = await new_pack({
				title,
				description,
				collaborators,
				pack_id: selected_parent_pack.value,
			});
			alert("all done!. navigating to newly created pack's page ...");
			nav(`/dashboard/packs/${id_of_new_pack}/`);
		} catch (error) {
			console.log(error);
			alert("something went wrong. details in console");
		}
	}

	async function get_data() {
		set_all_users(await get_users({ filters: {}, global_data }));
	}
	useEffect(() => {
		get_data();
	}, []);
	if (all_users === null) return <h1>loading users list... </h1>;
	return (
		<div className="p-2">
			<h1>New Pack</h1>
			<h1>user_id of the creator : {user_id}</h1>
			{["title", "description"].map((i, index) => {
				return (
					<React.Fragment key={index}>
						<h1>enter {i} :</h1>
						<input className="border border-blue-400 rounded px-1" id={i} />
					</React.Fragment>
				);
			})}

			<h1>choose collaborators of this new pack :</h1>
			<Select
				onChange={set_selected_collaborators}
				value={selected_collaborators}
				options={[
					...all_users
						.filter((user) => user._id !== user_id)
						.map((user) => {
							return {
								value: user._id,
								label: `@${user.username}`,
							};
						}),
				]}
				isMulti
				isSearchable
			/>
			<h1>choose a parent pack for this pack if you want:</h1>
			<Select
				onChange={set_selected_parent_pack}
				value={selected_parent_pack}
				options={[
					{ label: "without a parent", value: null },
					...global_data.user.packs.map((pack) => {
						return {
							value: pack._id,
							label: pack.title,
						};
					}),
				]}
			/>
			<button onClick={submit_new_pack}>submit</button>
		</div>
	);
};