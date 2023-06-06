import React, { useContext } from "react";
import { UnifiedHandlerClientContext } from "./UnifiedHandlerClientContext";

export const TimeMachine = () => {
	var { transactions, time_travel_snapshot } = useContext(UnifiedHandlerClientContext);

	return (
		<div>
			<h1>TimeMachine</h1>
			{time_travel_snapshot !== undefined && (
				<div>
					<i className="bi-clock-history" />
					<b>
						you have restricted transactions. currently caches are calculated up to a
						transaction with id = {time_travel_snapshot}
					</b>
					<button onClick={() => uhc.time_travel(undefined)}>remove restriction</button>
				</div>
			)}
			<table style={{ width: "100%" }}>
				<thead>
					<tr>
						<th>transaction id</th>
						<th>diff</th>
						<th>time</th>
						<th>user id</th>
						<th>activation</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((tr) => (
						<tr key={tr.id}>
							<td>{tr.id}</td>
							<td className="break-all">{JSON.stringify(tr.diff)}</td>
							<td>{tr.time}</td>
							<td>{tr.user_id}</td>
							<td>
								<button onClick={() => uhc.time_travel(tr.id)}>
									{tr.id === time_travel_snapshot ? (
										<i className="bi-toggle-on" />
									) : (
										<i className="bi-toggle-off" />
									)}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
