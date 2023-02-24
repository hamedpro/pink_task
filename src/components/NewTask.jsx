import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";
//import AdapterMoment from "@date-io/jalaali";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Section } from "./section";
import {
	custom_get_collection,
	get_calendar_categories,
	get_users,
	new_calendar_category,
	new_task,
} from "../../api/client";
import Select from "react-select";
import { GlobalDataContext } from "../GlobalDataContext";
import { StyledDiv } from "./styled_elements";
import { NewCalendarCategorySection } from "./NewCalendarCategorySection";
//TODO: component re-renders
export const NewTask = () => {
	var { global_data, get_global_data } = useContext(GlobalDataContext);
	var nav = useNavigate();
	var [search_params, set_search_params] = useSearchParams();

	/* if pack_id is present in url query we set default option of parent pack select to that  */
	var pack_id = search_params.get("pack_id");
	if (pack_id) {
		let pack = global_data.all.packs.find((pack) => pack._id === pack_id);
		var default_selected_parent_pack = {
			value: pack._id,
			label: pack.title,
		};
	} else {
		var default_selected_parent_pack = { value: null, label: "without a parent pack" };
	}

	/* selected_parent_pack must always be either one of them :
	{value : string , label : pack.title} or {value : null , label : "without a parent pack"} */
	var [selected_parent_pack, set_selected_parent_pack] = useState(default_selected_parent_pack);

	var user_id = localStorage.getItem("user_id");

	const [selectedNotes, selectNotes] = useState([]);
	const [title_input, set_title_input] = useState();
	const [description_input, set_description_input] = useState();
	var [all_users, set_all_users] = useState(null);
	var [calendar_categories, set_calendar_categories] = useState(null);
	var [notes, set_notes] = useState(null);
	//TODO: check _locale for possible option to output the _d(date) object in jalaali's format
	const [selected_dates, set_selected_dates] = useState({
		end: null,
		start: null,
	});
	useEffect(() => {
		async function tmp() {
			set_all_users(await get_users({ filters: {}, global_data }));
			set_calendar_categories(await get_calendar_categories({ user_id, global_data }));
			set_notes(await custom_get_collection({ context: "notes", user_id, global_data }));
		}
		tmp();
	}, [global_data]);

	var [selected_collaborators, set_selected_collaborators] = useState([]);
	async function submit_new_task() {
		var collaborators = selected_collaborators.map((i) => {
			return { is_owner: false, user_id: i.value };
		});
		collaborators.push({ is_owner: true, user_id });
		try {
			var tmp = {
				pack_id: selected_parent_pack.value,
				end_date: selected_dates.end,
				start_date: selected_dates.start,
				linked_notes: selectedNotes.map((i) => i.value),

				title: title_input,
				description: description_input,
				category_id: selected_calendar_category.value._id,
				collaborators,
			};
			var result = await new_task(tmp);
			if (result.has_error) {
				alert("Error! : " + result.error);
			} else {
				var id_of_new_task = result;
				alert("all done. navigating to the newly created task's page");
				nav(`/dashboard/tasks/${id_of_new_task}`);
			}
		} catch (error) {
			console.log(error);
			alert("something went wrong. details in console");
		}
		get_global_data();
	}
	var [selected_calendar_category, select_calendar_category] = useState(null);
	if (all_users === null || notes === null || calendar_categories === null)
		return <h1>still loading data ...</h1>;
	return (
		<div className="p-2">
			<h1>NewTask</h1>
			<h2 className="mt-2">enter a title for this task : </h2>
			<input className="px-1 rounded" onChange={(ev) => set_title_input(ev.target.value)} />
			<h2 className="mt-2">enter a description for this task : </h2>
			<textarea
				className="px-1 rounded"
				onChange={(ev) => set_description_input(ev.target.value)}
				rows={5}
			></textarea>

			<h2 className="mt-2">select an existing calendar category or create a new one</h2>
			<p>(if what you want was not in existing categories create it now in section below)</p>
			<Select
				onChange={select_calendar_category}
				value={selected_calendar_category}
				options={[
					...calendar_categories.map((cat) => {
						return {
							value: cat,
							label: `${cat.name} (${cat.color})`,
						};
					}),
				]}
				isSearchable
			/>
			<NewCalendarCategorySection />
			<h2 className="mt-2">select notes you want to link with this task :</h2>
			<Select
				onChange={selectNotes}
				options={notes.map((note) => {
					return {
						value: note._id,
						label: note.title,
					};
				})}
				isMulti
				isSearchable
				value={selectedNotes}
			/>

			<h2 className="mt-2">select 'start' and 'end' dates for this task : </h2>
			{["start", "end"].map((type, index) => {
				return (
					<div key={index} className="mb-3 block">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								renderInput={(props) => <TextField {...props} />}
								label={`select task ${type} date`}
								value={selected_dates[type]}
								onChange={(newValue) => {
									set_selected_dates((prev_dates) => {
										var tmp = { ...prev_dates };
										tmp[type] = newValue.$d.getTime();
										return tmp;
									});
								}}
							/>
						</LocalizationProvider>
					</div>
				);
			})}
			<h1>add collaborators to this new task :</h1>
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
			<h1>select a parent pack for this note if you want :</h1>
			<Select
				onChange={set_selected_parent_pack}
				value={selected_parent_pack}
				options={[
					{ value: null, label: "without a parent pack " },
					...global_data.user.packs.map((pack) => {
						return {
							value: pack._id,
							label: pack.title,
						};
					}),
				]}
				isSearchable
			/>
			<StyledDiv className="w-fit mt-2" onClick={submit_new_task}>
				submit
			</StyledDiv>
		</div>
	);
};
