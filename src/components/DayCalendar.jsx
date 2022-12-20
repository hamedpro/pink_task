import React, { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { get_calendar_categories, get_tasks, get_user_events } from "../../api/client";
import ObjectBox from "./ObjectBox";
import { month_names, timestamp_filled_range } from "../common";
import { Section } from "./Section";
export const DayCalendar = () => {
	var { user_id } = useParams();
	var [day_tasks, set_day_tasks] = useState(null);
	var [day_events, set_day_events] = useState(null);
	var [calendar_categories, set_calendar_categories] = useState(null);
	var [searchParams, setSearchParams] = useSearchParams();
	var tmp = searchParams.get("default");
	if (tmp !== null) {
		var year = Number(tmp.split("-")[0]);
		var month = month_names.indexOf(tmp.split("-")[1]) + 1;
		var day = Number(tmp.split("-")[2]);
	} else {
		var d = new Date();
		var year = d.getUTCFullYear();
		var month = d.getUTCMonth() + 1;
		var day = d.getUTCDate();
	}

	var start_timestamp = new Date(year, month - 1, day).getTime();
	var end_timestamp = start_timestamp + 3600 * 1000 * 24;
	async function get_data() {
		var tasks = await get_tasks({
			filters: {
				creator_user_id: user_id,
			},
		});
		var events = await get_user_events({ user_id });
		set_day_tasks(
			tasks
				.filter(
					(task) => task.start_date >= start_timestamp && task.end_date <= end_timestamp
				)
				.map((i) => {
					return {
						...i,
						human_readble_start_date: new Date(i.start_date).toString(),
						human_readble_end_date: new Date(i.end_date).toString(),
					};
				})
		);
		set_day_events(
			events
				.filter(
					(event) =>
						event.start_date >= start_timestamp && event.end_date <= end_timestamp
				)
				.map((i) => {
					return {
						...i,
						human_readble_start_date: new Date(i.start_date).toString(),
						human_readble_end_date: new Date(i.end_date).toString(),
					};
				})
		);
		set_calendar_categories(await get_calendar_categories({ user_id }));
	}
	useEffect(() => {
		get_data();
	}, []);
	if (calendar_categories === null || day_events === null || day_tasks === null)
		return <h1>loading data ...</h1>;
	return (
		<>
			<div className="p-2">
				<div>DayCalendar</div>
				<p>
					showing from {start_timestamp} : {new Date(start_timestamp).toDateString()}
				</p>
				<p>
					to {end_timestamp} : {new Date(end_timestamp).toDateString()}
				</p>
				<Section title="day tasks">
					tasks of this day :{" "}
					{day_tasks.map((task) => {
						return (
							<Fragment key={task._id}>
								<ObjectBox object={task} />
							</Fragment>
						);
					})}
				</Section>
				<Section title={"day events"}>
					events of this day :{" "}
					{day_events.map((event) => {
						return (
							<Fragment key={event._id}>
								<ObjectBox object={event} />
							</Fragment>
						);
					})}
				</Section>

				<Section title="bars">
					{[
						{ start: start_timestamp, end: start_timestamp + 12 * 3600 * 1000 },
						{ start: start_timestamp + 12 * 3600 * 1000, end: end_timestamp },
					].map((object, object_index) => {
						return (
							<div className="flex" key={object_index}>
								<div className="w-1/5">
									<div className="text-center" style={{ height: "30px" }}>
										time
									</div>
									<div className="text-center" style={{ height: "30px" }}>
										tasks
									</div>
									<div className="text-center" style={{ height: "30px" }}>
										events
									</div>
								</div>
								<div className="w-4/5">
									<div
										className="w-full bg-red-400"
										style={{ height: "30px" }}
									></div>
									{[
										{ items: JSON.parse(JSON.stringify(day_tasks)), ...object },
										{
											items: JSON.parse(JSON.stringify(day_events)),
											...object,
										},
									].map((type, type_index) => {
										return (
											<div
												key={type_index}
												className="w-full bg-stone-100 relative"
												style={{ height: "30px" }}
											>
												{timestamp_filled_range({ ...type }).map(
													(item, index, array) => {
														return (
															<div
																key={index}
																style={{
																	position: "absolute",
																	left: item.start_percent + "%",
																	width:
																		(item.end_percent -
																		item.start_percent) +
																		"%",
																	height: "100%",
																	backgroundColor:
																		item.value === null
																			? "white"
																			: calendar_categories.find(
																					(i) =>
																						i._id ==
																						item.category_id
																			  ).color,
																}}
																className={`${
																	index !== 0 ? "border-l" : ""
																} ${
																	index !== array.length - 1
																		? "border-r"
																		: ""
																} border-stone-400`}
															></div>
														);
													}
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</Section>
			</div>
		</>
	);
};
