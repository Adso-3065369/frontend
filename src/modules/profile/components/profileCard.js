import { Link, Badge, Card } from '@/components/ui';


export const profileCard = () => {
    const cardContent = 
    
    `
    <div class="flex items-center gap-5">
    <div class="bg-black w-20 h-20 flex justify-center items-center rounded-full">U</div>
    <div class="flex-row items-center">
    <p class="text-text-primary">Tu persona</p>
    <p class="text-text-secondary">Tu persona@gmail.com</p>
    </div>
    </div>
    ${Badge({
        text: "xdddddd",
        variant: 'info',
        className: 'w-20 h-10 rounded-xl border-none'
    })}`
    

    
    return Card({
                    children: cardContent,
                    bodyClass: 'flex-row gap-5 items-center px-5 py-10 justify-between'
                })
}