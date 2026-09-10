import { ApprovalStatus } from "./types"

export function getApprovalTemplate({approvalStatus, playerName, approverName}: {approvalStatus: ApprovalStatus, playerName: string, approverName: string}): string {
    if (approvalStatus === "Approved") {
    return (
`Hi ${playerName},

Thank you for your Submission!

Your Concord LARP Character has been approved! We look forward to seeing you at the next Summit!

Thanks
${approverName}
Player Support Team`
    )
    }   
    if (approvalStatus === "Denied") {
        return (
`Hi ${playerName},
            
Thanks
${approverName}
Player Support Team`
            )
    }
    if (approvalStatus === "Archived") {
        return (
`Hi ${playerName},

Your Concord LARP Character has been archived.

Thanks
${approverName}
Player Support Team`
        )
    }
    return "";
}
