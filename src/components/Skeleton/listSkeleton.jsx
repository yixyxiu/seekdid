export const ListSkeleton = () => {
    return (
      <div>
        <div className={`flex flex-row animate-pulse gap-2 my-3`}>
            <div className="h-6 mr-2 w-10/12 py-2 rounded-full bg-slate-200"/>                         
            <div className="h-6 w-2/12 rounded-full bg-slate-200 "></div>
        </div>
      </div>
    );
};