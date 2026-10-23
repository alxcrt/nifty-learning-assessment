export const ProgressBar = ({ progress }: { progress: number }) => {
	return (
		<div className="flex items-center gap-2">
			<div className="max-w-[80px] flex-1">
				<div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
					<div
						className="bg-primary h-2 rounded-full transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<span className="text-sm">{progress}%</span>
		</div>
	);
};
