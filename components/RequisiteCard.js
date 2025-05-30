import Link from 'next/link';
import Image from 'next/image';

export default function RequisiteCard({ name, description, icon, link, status }) {
    let statusText = "Not Tracked";
    let statusColorClass = "bg-gray-100 text-gray-500";
    let progressBarWidth = "0%";

    if (status !== undefined && status !== null) {
        if (!isNaN(parseFloat(status))) { // Assumes status is a percentage
            const numericStatus = parseFloat(status);
            progressBarWidth = `${Math.max(0, Math.min(100, numericStatus))}%`;
            if (numericStatus >= 75) {
                statusText = `Excellent (${numericStatus}%)`;
                statusColorClass = "bg-green-100 text-green-700";
            } else if (numericStatus >= 40) {
                statusText = `Good (${numericStatus}%)`;
                statusColorClass = "bg-yellow-100 text-yellow-600";
            } else {
                statusText = `Needs Attention (${numericStatus}%)`;
                statusColorClass = "bg-red-100 text-red-600";
            }
        } else { // Assumes status is a string like "Good", "Balanced"
            statusText = status;
            if (status.toLowerCase().includes("good") || status.toLowerCase().includes("balanced") || status.toLowerCase().includes("excellent")) {
                statusColorClass = "bg-green-100 text-green-700";
                progressBarWidth = "100%";
            } else if (status.toLowerCase().includes("attention") || status.toLowerCase().includes("low")) {
                statusColorClass = "bg-red-100 text-red-600";
                progressBarWidth = "25%";
            } else {
                statusColorClass = "bg-blue-100 text-blue-700"; // For general tracked statuses
                progressBarWidth = "50%";
            }
        }
    }

    return (
        <Link href={link} className="block group transform transition-all duration-300 hover:scale-[1.03]">
            <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-3">
                        <div className="mr-3 flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                            <Image src={icon} alt={`${name} icon`} width={28} height={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">{name}</h3>
                    </div>
                    <p className="text-sm text-mediumtext mb-3 text-ellipsis overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {description}
                    </p>
                </div>
                <div>
                    <div className="text-xs font-medium px-2.5 py-1 rounded-full inline-block mb-2 transition-colors duration-300 ${statusColorClass}">
                        {statusText}
                    </div>
                    {/* Progress Bar for percentage-based statuses */}
                    {(!isNaN(parseFloat(status))) && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                                parseFloat(status) >= 75 ? 'bg-green-500' : parseFloat(status) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} style={{ width: progressBarWidth }}></div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}