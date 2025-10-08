export default function CartPage(){
    return(
        <section className="min-h-screen bg-background text-foreground py-16">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
                    <p className="text-lg text-muted-foreground">Your cart is empty.</p>
                </div>
            </div>
        </section>
    )
}