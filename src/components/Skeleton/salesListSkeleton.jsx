export const SalesListSkeleton = () => {
    return (
      <div>
        <div className={`flex flex-row animate-pulse gap-2 my-3 content-center`}>
            <div className="h-8 w-8 rounded-full bg-slate-200"/> 
            <div className="h-8 mr-2 w-7/12 py-2 rounded-full bg-slate-200"/>
            <div className="h-8 mr-2 w-1/12"/>                          
            <div className="h-8 flex flex-col gap-1 w-3/12">
                <div className="h-4 w-full rounded-full bg-slate-200 mr-2"></div>
                <div className="h-3 w-full rounded-full bg-slate-200 mr-2"></div>
            </div>
        </div>
      </div>
    );
};