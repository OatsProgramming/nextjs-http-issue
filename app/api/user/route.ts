import prismadb from "@/lib/prismadb"
import { compare, hash } from "bcrypt"

export async function POST(req: Request) {
    try {
        // Extract data from body
        const { username, email, password }: User = await req.json()

        // Check if user exists already
        const userExists = await prismadb.user.findFirst({
            where: { 
                OR: [{ name: username }, { email }]
             }
        })
        
        if (userExists?.name === username) {
            return new Response("Username taken", { status: 400 })
        } else if (userExists?.email === email) {
            return new Response("An account associated with this email already exists", { status: 400 })
        }

        // Increase safety
        const hashedPassword = await hash(password, 10)

        // Create user in the db
        const user = await prismadb.user.create({
            data: { name: username, email, hashedPassword }
        })
    
        return new Response(JSON.stringify(user), { status: 200 })

    } catch (error) {
        console.log(error)
        const err = error as Error
        return new Response(err.message, { status: 400 })
    }
}

export async function PATCH(req: Request) {
    const body = await ValidReq(req) as NewInfo | Response
    if (body instanceof Response) return body

    // Only update what is given via req
    const newUser = await prismadb.user.update({
        where: { email: body.email },
        data: {
            email: body.newEmail || body.email,
            name: body.newUsername || body.username,
            hashedPassword: await hash((body.newPassword || body.password), 10)
        }
    })

    return new Response(JSON.stringify(newUser), { status: 200 })
}

export async function DELETE(req: Request) {
    const body = await ValidReq(req) as User | Response
    if (body instanceof Response) return body

    const user = await prismadb.user.delete({
        where: { email: body.email }
    })

    return new Response(JSON.stringify(user), { status: 200 })
}

async function ValidReq(req: Request) {
    const body = await req.json()

    // Check if user exists
    const user = await prismadb.user.findUnique({
        where: { email: body.email}
    })
    if (!user) {
        return new Response("User not found", { status: 404 })
    }
    
    // Check if password matches
    else if (!(await compare(body.password, user.hashedPassword))) {
        return new Response("Password mismatch", { status: 401 })
    }

    return body
}